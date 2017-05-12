import Ember from 'ember';

export default Ember.Route.extend({
    model() {
      const demo = this.modelFor('application');
      // First element is `null` as we start numbering things with 1 and not
      // zero based. But for the table oc contents we need a clean list.
      //return demo.titles.slice(1);
      return demo.titles;
    }
});
