import sinon from 'sinon';
import { module, test } from 'qunit';

import { adsSetup } from 'mobile-wiki/modules/ads/setup';

import { Events } from '../events';

module('Unit | Module | ads | setup', (hooks) => {
  let events;

  hooks.beforeEach(() => {
    events = new Events();

    window.Wikia.adEngine = {
      AdEngine() {
        this.init = () => {};
      },
      context: {},
      events,
    };

    const fake = sinon.fake.returns({});
    sinon.replace(adsSetup, 'setupAdContext', fake);
  });

  hooks.afterEach(() => {
    sinon.restore();
  });

  test('setupAdContext is called when page render event happens', (assert) => {
    adsSetup.init();

    const adContext = { a: 'a' };
    const instantGlobals = { b: 'b' };

    window.Wikia.adEngine.events.emit(events.PAGE_RENDER_EVENT, { adContext, instantGlobals });

    assert.equal(adsSetup.setupAdContext.callCount, 1);

    assert.deepEqual(adsSetup.setupAdContext.getCall(0).args[0], adContext);
    assert.deepEqual(adsSetup.setupAdContext.getCall(0).args[1], instantGlobals);
  });
});
