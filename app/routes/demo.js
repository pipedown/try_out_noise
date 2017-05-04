import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return {
            pageNo: params.demo_page
        };
    }
});
