import Ember from 'ember';

export default Ember.Route.extend({
    model() {
      const demo = this.modelFor('demo');
      return demo.current.description;
    }
});
