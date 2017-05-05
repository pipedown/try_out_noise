import Ember from 'ember';
import fetch from "ember-network/fetch";

export default Ember.Component.extend({
  tagName: '',
  tutorial: Ember.inject.service(),

  results: null,

  actions: {
    doQuery(query) {
      fetch("http://127.0.0.1:3000/query", {
        method: "POST",
        body: query
      }).then(data => {
        return data.json();
      }).then(json => {
        this.set('results', json);
      });
    }
  }
});
