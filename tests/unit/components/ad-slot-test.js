import Service from '@ember/service';
import { run } from '@ember/runloop';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Ads from 'mobile-wiki/modules/ads';
import { fanTakeoverResolver } from 'mobile-wiki/modules/ads/fan-takeover-resolver';

const adsStub = Service.extend({
  module: Ads.getInstance(),
});

module('Unit | Component | ad slot', (hooks) => {
  setupTest(hooks);
  let isUapLoaded = false;

  hooks.beforeEach(function () {
    this.owner.register('service:ads/ads', adsStub);
    this.ads = this.owner.lookup('service:ads/ads');
    window.Wikia.adProducts = {
      universalAdPackage: {
        isFanTakeoverLoaded: () => isUapLoaded,
      },
    };
  });

  test('Name lower case', function (assert) {
    const testCases = [
      {
        name: 'test',
        expected: 'test',
        description: 'No change',
      },
      {
        name: 'Test',
        expected: 'test',
        description: 'Lower case',
      },
      {
        name: 'Test ',
        expected: 'test-',
        description: 'Trailing space',
      },
      {
        name: 'Кириллица с пробелами',
        expected: 'кириллица-с-пробелами',
        description: 'Cyrillic with spaces',
      },
      {
        name: 'ويكيا العربية',
        expected: 'ويكيا-العربية',
        description: 'Arabic',
      },
    ];

    testCases.forEach((testCase) => {
      const component = this.owner.factoryFor('component:ad-slot').create();

      component.set('name', testCase.name);
      assert.equal(component.get('nameLowerCase'), testCase.expected, testCase.description);
    });
  });

  test('test UAP listeners', (assert) => {
    const testCases = [
      {
        isUapLoaded: true,
        callTwice: false,
        uapCallbackCount: 1,
        noUapCallbackCount: 0,
        message: 'uap callback called once',
      },
      {
        isUapLoaded: false,
        callTwice: false,
        uapCallbackCount: 0,
        noUapCallbackCount: 1,
        message: 'no uap callback called once',
      },
      {
        isUapLoaded: true,
        callTwice: true,
        uapCallbackCount: 2,
        noUapCallbackCount: 0,
        message: 'uap callback called twice',
      },
      {
        isUapLoaded: false,
        callTwice: true,
        uapCallbackCount: 0,
        noUapCallbackCount: 2,
        message: 'no uap callback called twice',
      },
    ];

    testCases.forEach((testCase) => {
      const ads = new Ads();
      const spyUap = sinon.spy();
      const spyNoUap = sinon.spy();

      fanTakeoverResolver.reset();
      ads.waitForUapResponse(spyUap, spyNoUap);
      isUapLoaded = testCase.isUapLoaded;
      fanTakeoverResolver.resolve();

      if (testCase.callTwice) {
        ads.waitForUapResponse(spyUap, spyNoUap);
      }

      setTimeout(() => {
        assert.equal(spyUap.callCount, testCase.uapCallbackCount, testCase.message);
        assert.equal(spyNoUap.callCount, testCase.noUapCallbackCount, testCase.message);
      }, 0);
    });
  });

  test('behaves correctly depending on noAds value', function (assert) {
    const testCases = [
      {
        properties: {
          isAboveTheFold: true,
          name: 'Test ad 1',
        },
        expectedResult: true,
        message: 'Element added to slot because no noAds property was passed',
      }, {
        properties: {
          isAboveTheFold: true,
          name: 'Test ad 2',
        },
        noAds: true,
        expectedResult: false,
        message: 'Element not added to slot because of noAds property value set to true',
      }, {
        properties: {
          isAboveTheFold: true,
          name: 'Test ad 3',
        },
        noAds: false,
        expectedResult: true,
        message: 'Element added to slot because of noAds property value set to false',
      },
    ];

    testCases.forEach((testCase) => {
      const component = this.owner.factoryFor('component:ad-slot').create();
      const pushSlotSpy = sinon.spy(component.get('ads.module'), 'pushSlotToQueue');

      this.ads.set('noAds', testCase.noAds);

      component.setProperties(testCase.properties);
      run(() => {
        component.didInsertElement();
        component.didEnterViewport();
      });

      assert.equal(
        pushSlotSpy.called,
        testCase.expectedResult,
        testCase.message,
      );

      component.get('ads.module').pushSlotToQueue.restore();
    });
  });
});
