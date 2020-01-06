import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | fandom-app-smart-banner', (hooks) => {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    this.owner.register('service:smartBanner', Service.extend({
      fandomAppCookieName: 'fandom-sb-closed',
    }));

    await render(hbs`<FandomAppSmartBanner />`);

    assert.dom('.smart-banner__store').hasText('fandom-app-banner.google-play');
  });

  test('hides banner, sets cookie for shorter period and calls tracker when close icon is clicked', async function (assert) {
    assert.expect(3);

    const fandomAppCookieName = 'fandom-sb-closed';

    const setCookie = sinon.spy();
    const setVisibility = sinon.spy();
    const track = sinon.spy();

    this.owner.register('service:smartBanner', Service.extend({
      fandomAppCookieName,
      setCookie,
      setVisibility,
      track,
    }));

    await render(hbs`<FandomAppSmartBanner />`);

    await click('.smart-banner__close');

    assert.ok(setCookie.calledOnceWith(fandomAppCookieName, 30));
    assert.ok(setVisibility.calledOnceWith(false));
    assert.ok(track.calledOnceWith(trackActions.close, 'smart-banner'));
  });

  test('hides banner, sets cookie for longer period and calls tracker when store link is clicked', async function (assert) {
    assert.expect(3);

    const fandomAppCookieName = 'fandom-sb-closed';

    const setCookie = sinon.spy();
    const setVisibility = sinon.spy();
    const track = sinon.spy();

    this.owner.register('service:smartBanner', Service.extend({
      fandomAppCookieName,
      setCookie,
      setVisibility,
      track,
    }));

    await render(hbs`<FandomAppSmartBanner />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a')
      .addEventListener('click', event => event.preventDefault());

    await click('a');

    assert.ok(setCookie.calledOnceWith(fandomAppCookieName, 90));
    assert.ok(setVisibility.calledOnceWith(false));
    assert.ok(track.calledOnceWith(trackActions.install, 'smart-banner'));
  });
});
