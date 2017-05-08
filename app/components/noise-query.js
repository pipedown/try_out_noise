import Ember from 'ember';
import fetch from "ember-network/fetch";

export default Ember.Component.extend({
  results: null,
  // Store the query that was set by the tutorial. If that query changes,
  // by going to another tutorial step, then empty the results.
  tutorialQuery: null,

  actions: {
    doQuery() {
      const query = this.$('textarea').val();
      fetch("http://127.0.0.1:3000/query", {
        method: "POST",
        body: query
      }).then(data => {
        return data.json();
      }).then(json => {
        this.set('results', json);
      });
    }
  },

  didUpdateAttrs() {
    // Empty the results only if the query changed to due to the tutorial,
    // don't empty them when the user does some input.
    if (this.get('tutorialQuery') != this.get('attrs').query.value) {
      this.set('results', null);
      this.set('tutorialQuery', this.get('attrs').query.value);
    }
  },
});
