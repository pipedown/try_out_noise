import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const tutorial = this.modelFor('application');
    const pageNo = parseInt(params.demo_page, 10);

    let next = null;
    if (pageNo + 1 < tutorial.descriptions.length) {
      next = {
        title: tutorial.titles[pageNo + 1],
        pageNo: pageNo + 1
      }
    }

    let prev = null;
    if (pageNo - 1 > 0) {
      prev = {
        title: tutorial.titles[pageNo - 1],
        pageNo: pageNo - 1
      }
    }

    return {
      pageNo: pageNo,
      current: {
        query: tutorial.queries[pageNo],
        description: tutorial.descriptions[pageNo],
      },
      next,
      prev
    };
  },
  afterModel(model) {
    // Always show the description when hitting a demo page
    this.replaceWith('demo.description', model.pageNo);
  }
});
