import sinon from 'sinon';
import { module, test } from 'qunit';

import { adsSetup } from 'mobile-wiki/modules/ads/setup';

import { events, EventService } from '../eventService';

module('Unit | Module | ads | setup', (hooks) => {
  let eventService;

  hooks.beforeEach(() => {
    eventService = new EventService();

    window.Wikia.adEngine = {
      AdEngine() {
        this.init = () => {};
      },
      context: {
        get: () => {},
        push: () => {},
      },
      events,
      eventService,
      slotTracker: {
        onChangeStatusToTrack: [],
        add: () => {
          return window.Wikia.adEngine.slotTracker;
        },
        register: () => {},
      },
      templateService: {
        register: () => {},
      },
      viewabilityTracker: {
        add: () => {
          return window.Wikia.adEngine.slotTracker;
        },
        register(),
      },
    };
    window.Wikia.adBidders = {};
    window.Wikia.adProducts = {
      setupNpaContext: () => {},
      playerEvents: {
        VIDEO_PLAYER_TRACKING_EVENT: Symbol('VIDEO_PLAYER_TRACKING_EVENT'),
      },
      porvataTracker: {
        register: () => {},
      },
    };

    const fake = sinon.fake.returns({});
    sinon.replace(adsSetup, 'setupAdContext', fake);
  });

  hooks.afterEach(() => {
    sinon.restore();
  });

  test('setupAdContext is called when page render event happens', (assert) => {
    adsSetup.configure();

    const adContext = { a: 'a' };
    const instantGlobals = { b: 'b' };

    window.Wikia.adEngine.eventService.emit(
      events.PAGE_RENDER_EVENT,
      { adContext, instantGlobals },
    );

    assert.equal(adsSetup.setupAdContext.callCount, 2);

    assert.deepEqual(adsSetup.setupAdContext.getCall(1).args[0], adContext);
    assert.deepEqual(adsSetup.setupAdContext.getCall(1).args[1], instantGlobals);
  });
});
