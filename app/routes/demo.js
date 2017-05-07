import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const tutorial = this.modelFor('application');
    const pageNo = parseInt(params.demo_page, 10);
    return {
      current: {
        query: tutorial.queries[pageNo],
        description: tutorial.descriptions[pageNo],
      },
      // TODO vmx 2017-05-06: Only define it if there's a next step
      next: {
        title: tutorial.titles[pageNo + 1],
        pageNo: pageNo + 1
      },
      // TODO vmx 2017-05-06: Only define it if there's a previous step
      prev: {
        title: tutorial.titles[pageNo - 1],
        pageNo: pageNo - 1
      }
    };
  }
});
