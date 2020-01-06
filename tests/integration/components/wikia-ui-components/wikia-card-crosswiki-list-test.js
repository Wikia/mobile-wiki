import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | wikia-ui-components | wikia-card-crosswiki-list', (hooks) => {
  setupRenderingTest(hooks);

  test('should render items', async function (assert) {
    assert.expect(5);

    const item = {
      url: 'https://starwars.fandom.com/', title: 'Test', snippet: 'Lorem ipsum', sitename: 'Wookieepedia',
    };

    this.set('items', [item]);

    await render(hbs`<WikiaUiComponents::WikiaCardCrosswikiList @items={{this.items}}/>`);

    assert.dom('.wikia-card a', this.element).exists({ count: 1 });

    assert.dom('.wikia-card a', this.element).hasAttribute('href', item.url);
    assert.dom('.wikia-card .wikia-card__title', this.element).hasText(item.title);
    assert.dom('.wikia-card .wikia-card__snippet', this.element).hasText(item.snippet);
    assert.dom('.wikia-card .wikia-card__community_name', this.element).hasText(item.sitename);
  });

  test('should call itemClicked on item click', async function (assert) {
    assert.expect(1);

    const itemClicked = sinon.spy();
    const item = {
      url: 'https://starwars.fandom.com', title: 'Test', snippet: 'Lorem ipsum', sitename: 'Wookieepedia',
    };

    this.set('itemClicked', itemClicked);
    this.set('items', [item]);

    await render(hbs`<WikiaUiComponents::WikiaCardCrosswikiList @items={{this.items}} @itemClick={{this.itemClicked}} />`);

    await click('.wikia-card');

    assert.ok(itemClicked.calledOnceWith(item));
  });
});
