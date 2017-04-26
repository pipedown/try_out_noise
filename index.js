var http = require('http');
var accesslog = require('access-log');
var nconf = require('nconf');
var noise = require('noise-search');
var async = require('async');
var fs = require("fs");

nconf.use('file', { file: './config.json' });
nconf.load();

if (typeof nconf.get("last_indexed") == "undefined") {
    nconf.set("last_indexed", 0);
    nconf.save(function (err) {
        if (err) {
            console.error(err.message);
            return;
        }
    });
}

// open the index, create if missing
let index = noise.open('show_index', true);

// create a queue of http fetches.
 var httpQ = async.queue((task, callback) => {
            task(callback);
        }, 1);

function indexShow(showListing) {
    httpQ.push(callback => {
        var options = {
            host: 'api.tvmaze.com',
            path: '/shows/' + showListing.id.toString() + "?embed[]=episodes&embed[]=cast"
        };

        http.get(options, response => {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                let show = JSON.parse(str);
                if (!show.id) {
                    callback();
                    return;
                }
                show._id = show.id.toString();
                index.add(show).then(id => {
                    console.log("Indexed " + show.name +' (' + id + ')');
                    nconf.set('last_indexed', id);
                    nconf.save();
                }).catch(e => {
                    console.log(e);
                });
                callback();
            });
        }).on('error', e => {
            // unsure what to do
            console.log(e);
        });
    });

}

function getLatestShows(pageNum) {
    let getLatest = callback => {
        var options = {
            host: 'api.tvmaze.com',
            path: '/shows?page=' + pageNum
        };

        http.get(options, response => {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('error', function (e) {
                console.log(e);
            });

            response.on('end', function () {
                let shows = JSON.parse(str);
                shows.forEach(showListing => {
                    if (nconf.get("last_indexed") < showListing.id) {
                        indexShow(showListing);
                    }
                });
                if (shows.length != 0) {
                    getLatestShows(pageNum + 1);
                } else {
                    // try again for latest in 12 hrs
                    setInterval(getLatestShows, 1000*60*60*12, Math.floor(nconf.get("last_indexed") / 250));
                }
                callback();
            });
        });
    };
    httpQ.push(getLatest);
}

// get the shows to index

// the show listings limits 250 shows per page. So we divide by 250
// to get the necessary page to for the next shows
getLatestShows(Math.floor(nconf.get("last_indexed") / 250));

// start the webserver

const hostname = '0.0.0.0';
const port = 3000;
const maxPostSize = 4 * 1024;
const accessLogFormat = ':ip - :userID [:endDate] ":method :url :protocol/:httpVersion" :statusCode :contentLength ":referer" ":userAgent"';
const escapeNewlineRegexp = /\n|\r\n|\r/g;

const server = http.createServer((req, res) => {
    if (req.method == 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        var buf = fs.readFileSync('./index.html');
        res.end(buf);
    } else if (req.method == 'POST') {
        var str = '';
        req.on('data', chunk => {
            str += chunk;
            if (str.length > maxPostSize) {
                req.removeAllListeners('data');
                req.removeAllListeners('end');
                res.statusCode = 413;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({error: 'The query was too long.'}));
            }
        });
        req.on('end', () => {
            accesslog(req, res, accessLogFormat, s => {
                console.log(s, '|', str.replace(escapeNewlineRegexp, '\\n'));
            });
            index.query(str).then(results => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(results, null, 2));
                res.end();
            }).catch(e => {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({error: '' + e}));

            });
        });
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});







