import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | full-main-page-content', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  test('renders with collapsed section', async function(assert) {
    assert.expect(1);

    await render(hbs`<FullMainPageContent @content="" />`);

    assert.dom('h2', this.element).hasNoClass('open-section');
  });

  test('toggles collapsed section state on header click', async function(assert) {
    assert.expect(2);

    await render(hbs`<FullMainPageContent @content="" />`);

    await click('h2');

    assert.dom('h2', this.element).hasClass('open-section');

    await click('h2');

    assert.dom('h2', this.element).hasNoClass('open-section');
  });
});
