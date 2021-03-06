import Ember from 'ember';
import ENV from '../config/environment'

export default Ember.Component.extend({
  classNames: ['noise-query-and-results'],
  results: null,
  // Store the query that was set by the tutorial. If that query changes,
  // by going to another tutorial step, then empty the results.
  tutorialQuery: null,

  actions: {
    doQuery() {
      const query = this.$('textarea').val();
      Ember.$.post('//' + window.location.hostname + ENV.noiseUrl, query)
        .done(data => {
          this.set('results', data);
        })
        .fail(error => {
          this.set('results', [error.responseJSON]);
        });
      this.set('results', 'in-progress');
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
