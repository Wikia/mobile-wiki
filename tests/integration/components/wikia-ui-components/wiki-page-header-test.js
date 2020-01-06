import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';

module('Integration | Component | wikia-ui-components | wiki-page-header', (hooks) => {
  setupRenderingTest(hooks);

  const heroImage = {
    type: 'image',
    url: 'https://vignette.wikia.nocookie.net/starwars/images/1/1d/Bossk.png/revision/latest?cb=20130219044712',
    fileUrl: 'http://starwars.fandom.com/wiki/File:Bossk.png',
    fileName: 'Bossk.png',
    title: 'Bossk.png',
    user: 'JMAS',
    mime: 'image/png',
    isVideo: false,
    isOgg: false,
    href: 'https://vignette.wikia.nocookie.net/starwars/images/1/1d/Bossk.png/revision/latest?cb=20130219044712',
    isLinkedByUser: false,
    width: 720,
    height: 800,
    context: 'infobox-hero-image',
    thumbnail4by5: 'https://vignette.wikia.nocookie.net/starwars/images/1/1d/Bossk.png/revision/latest/top-crop/width/360/height/450?cb=20130219044712',
    thumbnail4by52x: 'https://vignette.wikia.nocookie.net/starwars/images/1/1d/Bossk.png/revision/latest/top-crop/width/720/height/900?cb=20130219044712',
    thumbnail4by5Width: 360,
    thumbnail4by5Height: 450,
    thumbnail1by1: 'https://vignette.wikia.nocookie.net/starwars/images/1/1d/Bossk.png/revision/latest/top-crop/width/360/height/360?cb=20130219044712',
    thumbnail1by1Size: 360,
  };

  hooks.beforeEach(function () {
    this.owner.register('service:wikiVariables', Service.extend({
      siteName: 'Test Wiki',
    }));
    this.owner.register('service:lightbox', Service.extend({}));
  });

  test('renders for main page without subtitle', async function (assert) {
    assert.expect(2);

    this.setProperties({
      title: 'Don\'t Show This Title',
      subtitle: 'Should be hidden',
      isMainPage: true,
    });

    await render(hbs`<WikiaUiComponents::WikiPageHeader @title={{this.title}} @subtitle={{this.subtitle}} @isMainPage={{this.isMainPage}} />`);

    assert.dom('.wiki-page-header__title', this.element).hasText('Test Wiki');
    assert.dom('.wiki-page-header__subtitle', this.element).doesNotExist();
  });

  test('renders for normal page with subtitle', async function (assert) {
    assert.expect(2);

    const title = 'Test Page';
    const subtitle = 'This is the subtitle';

    this.setProperties({
      title,
      subtitle,
    });

    await render(hbs`<WikiaUiComponents::WikiPageHeader @title={{this.title}} @subtitle={{this.subtitle}} />`);

    assert.dom('.wiki-page-header__title', this.element).hasText(title);
    assert.dom('.wiki-page-header__subtitle', this.element).hasText(subtitle);
  });

  test('renders for normal page with no subtitle', async function (assert) {
    assert.expect(2);

    const title = 'Test Page';

    this.setProperties({ title });

    await render(hbs`<WikiaUiComponents::WikiPageHeader @title={{this.title}} />`);

    assert.dom('.wiki-page-header__title', this.element).hasText(title);
    assert.dom('.wiki-page-header__subtitle', this.element).doesNotExist();
  });

  test('renders for normal page with hero image', async function (assert) {
    assert.expect(3);

    const title = 'Test Page';

    this.setProperties({
      title,
      heroImage,
    });

    await render(hbs`<WikiaUiComponents::WikiPageHeader @title={{this.title}} @heroImage={{this.heroImage}} />`);

    const heroImageSelector = '.wiki-page-header__hero-image > a > img.article-media-placeholder';

    assert.dom(heroImageSelector, this.element).hasAttribute('src', heroImage.thumbnail4by5);
    assert.dom(heroImageSelector, this.element).hasAttribute('srcset', `${heroImage.thumbnail4by5}, ${heroImage.thumbnail4by52x} 2x`);
    assert.dom('.wiki-page-header__hero-image > a', this.element).hasAttribute('href', heroImage.url);
  });

  test('opens lightbox on hero image click', async function (assert) {
    assert.expect(1);

    const open = sinon.spy();

    this.owner.register('service:lightbox', Service.extend({ open }));

    this.setProperties({
      title: 'Test title',
      heroImage,
    });

    await render(hbs`<WikiaUiComponents::WikiPageHeader @title={{this.title}} @heroImage={{this.heroImage}} />`);

    await click('.wiki-page-header__hero-image > a');

    assert.ok(open.calledOnceWith('media', heroImage));
  });
});
