# try_out_noise
Demo to let users try out Noise queries in the browser.


Setup
-----

    npm install


Running
-------

### Manually

For sunning the demo, simply execute it:

    node index.js

It will start downloading the TV shows from
[tvmaze.com](http://www.tvmaze.com/) automatically. You can access the
demo at [http://localhost:3000/](http://localhost:3000/).


### Via Systemd

It's also possible to start it via Systemd. Copy the supplied Systemd Service
script from
[scripts/systemd/try-out-noise.service](scripts/systemd/try-out-noise.service)
to `/etc/systemd/system/`. Modify it to fit your environment, especially the
`User` and `WorkingDirectory` settings.

Then enable the Service, reload the Systemd Daemon and start it:

    sudo systemctl enable try-out-noise
    sudo systemctl daemon-reload
    sudo systemctl start try-out-noise

You can double check if it really start with looking at the logs:

    journalctl -u try-out-noise -f

It should look something like this:

    Apr 28 01:39:53 frea systemd[1]: Started Try out Noise.
    Apr 28 01:39:53 frea node[28904]: Server running at http://0.0.0.0:3000/
    Apr 28 01:39:53 frea node[28904]: Settings: {"NOISE_QUERY_INDEXES": 4, "NOISE_MAX_WAITING_CLIENTS": 10, "NOISE_ACQUIRE_TIMEOUT": 5000}


### Environment variables

The demo can be tweaked with some environment variables:

 - `NOISE_QUERY_INDEXES` (default: 4): Number of indexes that are opened for querying. This is also the number of queries that can run in parallel.
 - `NOISE_MAX_WAITING_CLIENTS` (default: 10): Number of clients that will be queued up before they return with an error.
 - `NOISE_ACQUIRE_TIMEOUT` (default: 5000): The time in milliseconds that will be be tried to acquire an index to query on. This is for the waiting clients.


Monitoring
----------

If you run the demo on a server, you might want to have some additional
monitoring in case it gets stuck. The `scripts/monitor-try-out-noise.sh`
script will send a request to the server. If it doesn't respond in timely
fashion, it will kill the server.

The monitoring is run best when the demo as well as the monitoring is under
the supervision of Systemd. Copy the
[scripts/systemd/monitor-try-out-noise.service](scripts/systemd/monitor-try-out-noise.service)
to `/etc/systemd/system/` and modify it to fit your environment, especially the
`User` and `WorkingDirectory` settings.

Then enable the Service, reload the Systemd Daemon and start it:

    sudo systemctl enable monitor-try-out-noise
    sudo systemctl daemon-reload
    sudo systemctl start monitor-try-out-noise

You can double check if it really start with looking at the logs:

    journalctl -u monitor-try-out-noise -f

It should look something like this:

    Apr 28 01:53:47 frea systemd[1]: Started Monitor for Try out Noise
