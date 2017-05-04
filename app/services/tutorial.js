import Ember from 'ember';
import fetch from "ember-network/fetch";

export default Ember.Service.extend({
  pages: null,

  init() {
    this._super(...arguments);

    // The contents of the tutorial is kept in a static HTML file.
    // It's loaded once, whenever this service is started.
    fetch('/assets/html/tutorial.html').then(response => {
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

      // Extract queries
      const queries = dom.find('code');

      // Remove the queries from the DOM as we only want the descriptions
      queries.remove();

      // Extract the descriptions
      const descriptions = dom.find('article');

      // The first element is a dummy element so that we can start
      // enumerating the tutorial steps starting with 1.
      let pages = [null];

      // Re-combine the queries and the descriptions as JSON
      descriptions.each((ii, description) => {
        pages.push({
          description: description,
          query: Ember.$(queries[ii]).text().trim()
        });
      });
      this.set('pages', pages);
    });
  }
});
