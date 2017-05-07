import Ember from 'ember';

export default Ember.Route.extend({
  // An array with the query of the current tutorial step. First one
  // is at index `1` to have nice URLs and easier logic
  queries: null,

  // An array with the description of the current tutorial step. First one
  // is at index `1` to have nice URLs and easier logic
  descriptions: null,

  // An array with the title of the current tutorial step. First one
  // is at index `1` to have nice URLs and easier logic
  titles: null,

  beforeModel() {
    return fetch('/assets/html/tutorial.html').then(response => {
      return response.text();
    }).then(text => {
      // The returned value is a full HTML document. If the dom is created
      // with just calling `$(text)`, then the top level elements would be the
      // children of the `<body>` (and not the full HTML tree as expected).
      // This makes traversing the DOM quite difficult. Hence append it to an
      // newly created `<body>` tag, so that the traversal works as expected.
      // For more information see https://api.jquery.com/jQuery/#jQuery2 about
      // "passing in complex HTML".
      const dom = Ember.$('<body>').append(text);

      // Extract code tags that contain the queries
      const codeTags = dom.find('code');

      // Remove the code tags from the DOM as we only want the descriptions
      codeTags.remove();

      // Extract the article tags that contain the descriptions
      const articleTags = dom.find('article');

      // Extract the h3 tags that contain the titles
      const h3Tags = dom.find('h3');

      // The first element is a dummy element so that we can start
      // enumerating the tutorial steps starting with 1.
      let queries = [null];
      let descriptions = [null];
      let titles = [null];

      // Re-combine the queries and the descriptions as JSON
      articleTags.each((ii, articleTag) => {
        queries.push(Ember.$(codeTags[ii]).text().trim());
        descriptions.push(articleTag);
        titles.push(Ember.$(h3Tags[ii]).text().trim());
      });
      this.set('queries', queries);
      this.set('descriptions', descriptions);
      this.set('titles', titles);
    });
  },
  model() {
    return {
      queries: this.get('queries'),
      descriptions: this.get('descriptions'),
      titles: this.get('titles')
    };
  }
});
