import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { transparentImageBase64 } from 'mobile-wiki/utils/thumbnail';

module('Integration | Component | curated-content-item', (hooks) => {
  setupRenderingTest(hooks);

  const item = {
    label: 'Season 1',
    imageUrl: null,
    imageCrop: null,
    type: 'category',
    url: '/wiki/Category:Season_1',
  };

  test('it renders', async function (assert) {
    assert.expect(4);

    this.set('model', item);

    await render(hbs`<CuratedContentItem @model={{this.model}} />`);

    assert.dom('.item-image > img', this.element).hasAttribute('src', transparentImageBase64);
    assert.dom('.item-image > img', this.element).hasAttribute('alt', item.label);

    assert.dom('a', this.element).hasAttribute('href', item.url);

    assert.dom('.item-caption', this.element).hasText(item.label);
  });
});
