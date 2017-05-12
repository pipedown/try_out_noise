import Ember from 'ember';

export default Ember.Route.extend({
    model() {
      const application = this.modelFor('application');
      return application.schema;
    }
});
