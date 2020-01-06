import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import Service from '@ember/service';

module('Integration | Component | category-alphabet-shortcuts', (hooks) => {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  test('renders default shortcuts', async function (assert) {
    assert.expect(2);

    this.set('loadFrom', () => {});

    await render(hbs`<CategoryAlphabetShortcuts @loadFrom={{this.loadFrom}} />`);

    assert.dom('.category-alphabet-shortcuts__item').exists({ count: 28 });
    assert.dom('.category-alphabet-shortcuts__item.is-active').doesNotExist();
  });

  test('renders active shortcut', async function (assert) {
    assert.expect(1);

    this.set('loadFrom', () => {});

    await render(hbs`<CategoryAlphabetShortcuts @from="A" @loadFrom={{this.loadFrom}} />`);

    assert.dom('.category-alphabet-shortcuts__item.is-active').hasText('A');
  });

  test('calls loadFrom when shortcut is clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.set('loadFrom', loadFrom);

    await render(hbs`<CategoryAlphabetShortcuts @loadFrom={{this.loadFrom}} />`);
    await click('.category-alphabet-shortcuts__item:nth-child(3)');

    assert.ok(loadFrom.calledOnceWith('B'));
  });
});
