import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('local-navigation-for-seo', 'Integration | Component | local navigation for seo', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{local-navigation-for-seo}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#local-navigation-for-seo}}
      template block text
    {{/local-navigation-for-seo}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
