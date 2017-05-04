import Ember from 'ember';

export function stringify([value, space = 2]) {
  return JSON.stringify(value, null, space);
}

export default Ember.Helper.helper(stringify);
