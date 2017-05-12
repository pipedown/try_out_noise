import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('demo', {path: '/demo/:demo_page'}, function() {
    this.route('description');
    this.route('schema');
    this.route('toc');
  });
});

export default Router;
