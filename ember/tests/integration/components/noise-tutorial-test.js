import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('noise-tutorial', 'Integration | Component | noise tutorial', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{noise-tutorial}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#noise-tutorial}}
      template block text
    {{/noise-tutorial}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
