import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | portable-infobox', (hooks) => {
  setupRenderingTest(hooks);

  const content = '<div id="mock-infobox-content"></div>';
  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders short infobox', async function (assert) {
    assert.expect(3);

    this.setProperties({
      content,
      height: 50,
    });

    await render(hbs`<PortableInfobox @height={{this.height}} @infoboxHTML={{this.content}} />`);

    assert.dom('.portable-infobox.pi', this.element).hasNoClass('collapsed');
    assert.dom('.portable-infobox.pi > #mock-infobox-content', this.element).exists();
    assert.dom('.portable-infobox.pi + .pi-expand-button', this.element).doesNotExist();
  });

  test('renders long infobox', async function (assert) {
    assert.expect(3);

    this.setProperties({
      content,
      height: 1600,
    });

    await render(hbs`<PortableInfobox @height={{this.height}} @infoboxHTML={{this.content}} />`);

    assert.dom('.portable-infobox.pi', this.element).hasClass('collapsed');
    assert.dom('.portable-infobox.pi > #mock-infobox-content', this.element).exists();
    assert.dom('.portable-infobox.pi + .pi-expand-button', this.element).hasText('app.more');
  });

  test('toggles long infobox collapsed state on button click', async function (assert) {
    assert.expect(9);

    this.setProperties({
      content,
      height: 1600,
    });

    await render(hbs`<PortableInfobox @height={{this.height}} @infoboxHTML={{this.content}} />`);

    assert.dom('.portable-infobox.pi', this.element).hasClass('collapsed');
    assert.dom('.portable-infobox.pi + .pi-expand-button', this.element).hasText('app.more');

    await click('.portable-infobox.pi + .pi-expand-button');

    assert.ok(trackStub.lastCall.calledWith({
      action: trackActions.click,
      category: 'portable-infobox',
      label: 'expanded-by-button',
    }));

    assert.dom('.portable-infobox.pi', this.element).hasNoClass('collapsed');
    assert.dom('.portable-infobox.pi + .pi-expand-button', this.element).hasText('app.less');

    await click('.portable-infobox.pi + .pi-expand-button');

    assert.ok(trackStub.lastCall.calledWith({
      action: trackActions.click,
      category: 'portable-infobox',
      label: 'collapsed-by-button',
    }));

    assert.dom('.portable-infobox.pi', this.element).hasClass('collapsed');
    assert.dom('.portable-infobox.pi + .pi-expand-button', this.element).hasText('app.more');

    assert.ok(trackStub.calledTwice);
  });
});
