import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule from 'mobile-wiki/utils/track';

module('Integration | Component | curated-content', (hooks) => {
  setupRenderingTest(hooks);

  const model = {
    type: 'section',
    items: [
      {
        label: 'Season 1',
        imageUrl: null,
        type: 'section',
        items: [
          {
            label: 'Season 1',
            imageUrl: null,
            imageCrop: null,
            type: 'category',
            url: '/wiki/Category:Season_1',
          },
          {
            label: 'Episodes',
            imageUrl: null,
            imageCrop: null,
            type: 'category',
            url: '/wiki/Category:Season_1_Episodes',
          },
        ],
        imageCrop: null,
      },
      {
        label: 'Season 2',
        imageUrl: null,
        type: 'section',
        items: [
          {
            label: 'Season 2',
            imageUrl: null,
            imageCrop: null,
            type: 'category',
            url: '/wiki/Category:Season_2',
          },
          {
            label: 'Episodes',
            imageUrl: null,
            imageCrop: null,
            type: 'category',
            url: '/wiki/Category:Season_2_Episodes',
          },
        ],
        imageCrop: null,
      },
    ],
  };

  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('it renders', async function (assert) {
    assert.expect(4);

    this.set('model', model);

    await render(hbs`<CuratedContent @model={{this.model}} />`);

    assert.dom('.curated-content-section', this.element).exists({ count: 3 });

    assert.dom('.curated-content-section:nth-child(1)', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(2)', this.element).hasClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(3)', this.element).hasClass('wds-is-hidden');
  });

  test('toggles section on click', async function (assert) {
    assert.expect(6);

    this.set('model', model);

    await render(hbs`<CuratedContent @model={{this.model}} />`);

    await click('.item-image');

    assert.dom('.curated-content-section:nth-child(1)', this.element).hasClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(2)', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(3)', this.element).hasClass('wds-is-hidden');

    await click('.curated-content-section:nth-child(2) .curated-content-section__back');

    assert.dom('.curated-content-section:nth-child(1)', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(2)', this.element).hasClass('wds-is-hidden');
    assert.dom('.curated-content-section:nth-child(3)', this.element).hasClass('wds-is-hidden');
  });
});
