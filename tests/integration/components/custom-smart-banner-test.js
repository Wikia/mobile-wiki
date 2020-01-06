import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {click, render} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | custom-smart-banner', function(hooks) {
  setupRenderingTest(hooks);

  const smartBannerAdConfiguration = {
    text: 'This is the banner',
    linkUrl: 'https://www.example.com',
    linkText: 'Click me',
    imageUrl: 'https://www.example.com/test.jpg',
    title: 'This is the title'
  };

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    this.owner.register('service:wikiVariables', Service.extend({ smartBannerAdConfiguration }));
  });

  test('it renders', async function(assert) {
    assert.expect(5);

    await render(hbs`<CustomSmartBanner />`);

    assert.dom('a.smart-banner__link', this.element).hasAttribute('href', smartBannerAdConfiguration.linkUrl);
    assert.dom('img.smart-banner__icon', this.element).hasAttribute('src', smartBannerAdConfiguration.imageUrl);

    assert.dom('.smart-banner__title', this.element).hasText(smartBannerAdConfiguration.title);
    assert.dom('.smart-banner__description', this.element).hasText(smartBannerAdConfiguration.text);
    assert.dom('.smart-banner__install', this.element).hasText(smartBannerAdConfiguration.linkText);
  });

  test('hides banner, sets cookie for shorter period and calls tracker when close icon is clicked', async function(assert) {
    assert.expect(3);

    const customCookieName = 'custom-sb-closed';

    const setCookie = sinon.spy();
    const setVisibility = sinon.spy();
    const track = sinon.spy();

    this.owner.register('service:smartBanner', Service.extend({
      customCookieName,
      setCookie,
      setVisibility,
      track,
    }));

    await render(hbs`<CustomSmartBanner />`);

    await click('.smart-banner__close');

    assert.ok(setCookie.calledOnceWith(customCookieName, 30));
    assert.ok(setVisibility.calledOnceWith(false));
    assert.ok(track.calledOnceWith(trackActions.close, 'custom-smart-banner'));
  });

  test('hides banner, sets cookie for longer period and calls tracker when store link is clicked', async function(assert) {
    assert.expect(3);

    const customCookieName = 'custom-sb-closed';

    const setCookie = sinon.spy();
    const setVisibility = sinon.spy();
    const track = sinon.spy();

    this.owner.register('service:smartBanner', Service.extend({
      customCookieName,
      setCookie,
      setVisibility,
      track,
    }));

    await render(hbs`<CustomSmartBanner />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a')
      .addEventListener('click', event => event.preventDefault());

    await click('a');

    assert.ok(setCookie.calledOnceWith(customCookieName, 90));
    assert.ok(setVisibility.calledOnceWith(false));
    assert.ok(track.calledOnceWith(trackActions.install, 'custom-smart-banner'));
  });
});
