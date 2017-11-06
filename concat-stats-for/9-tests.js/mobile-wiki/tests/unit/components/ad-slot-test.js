define('mobile-wiki/tests/unit/components/ad-slot-test', ['sinon', 'require', 'ember-qunit'], function (_sinon, _require2, _emberQunit) {
	'use strict';

	var adsStub = Ember.Service.extend({
		module: (0, _require2.default)('mobile-wiki/modules/ads').default.getInstance()
	});

	(0, _emberQunit.moduleForComponent)('ad-slot', 'Unit | Component | ad slot', {
		unit: true,
		needs: ['service:fastboot', 'service:logger', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			this.register('service:ads', adsStub);
			this.inject.service('ads', { as: 'ads' });
		}
	});

	(0, _emberQunit.test)('Name lower case', function (assert) {
		var _this = this;

		var testCases = [{
			name: 'test',
			expected: 'test',
			description: 'No change'
		}, {
			name: 'Test',
			expected: 'test',
			description: 'Lower case'
		}, {
			name: 'Test ',
			expected: 'test-',
			description: 'Trailing space'
		}, {
			name: 'Кириллица с пробелами',
			expected: 'кириллица-с-пробелами',
			description: 'Cyrillic with spaces'
		}, {
			name: 'ويكيا العربية',
			expected: 'ويكيا-العربية',
			description: 'Arabic'
		}];

		testCases.forEach(function (testCase) {
			var component = _this.subject();

			component.set('name', testCase.name);
			assert.equal(component.get('nameLowerCase'), testCase.expected, testCase.description);
		});
	});

	(0, _emberQunit.test)('test UAP listeners', function (assert) {
		var testCases = [{
			eventName: 'wikia.uap',
			callTwice: false,
			uapCallbackCount: 1,
			noUapCallbackCount: 0,
			message: 'uap callback called once'
		}, {
			eventName: 'wikia.not_uap',
			callTwice: false,
			uapCallbackCount: 0,
			noUapCallbackCount: 1,
			message: 'no uap callback called once'
		}, {
			eventName: 'wikia.uap',
			callTwice: true,
			uapCallbackCount: 2,
			noUapCallbackCount: 0,
			message: 'uap callback called twice'
		}, {
			eventName: 'wikia.not_uap',
			callTwice: true,
			uapCallbackCount: 0,
			noUapCallbackCount: 2,
			message: 'no uap callback called twice'
		}];

		testCases.forEach(function (testCase) {
			var Ads = (0, _require2.default)('mobile-wiki/modules/ads').default,
			    ads = new Ads(),
			    spyUap = _sinon.default.spy(),
			    spyNoUap = _sinon.default.spy();

			ads.waitForUapResponse(spyUap, spyNoUap);
			window.dispatchEvent(new Event(testCase.eventName));

			if (testCase.callTwice) {
				ads.waitForUapResponse(spyUap, spyNoUap);
			}

			assert.equal(testCase.uapCallbackCount, spyUap.callCount, testCase.message);
			assert.equal(testCase.noUapCallbackCount, spyNoUap.callCount, testCase.message);
		});
	});

	(0, _emberQunit.test)('behaves correctly depending on noAds value', function (assert) {
		var _this2 = this;

		var testCases = [{
			properties: {
				isAboveTheFold: true,
				name: 'Test ad 1'
			},
			expectedResult: true,
			message: 'Element added to slot because no noAds property was passed'
		}, {
			properties: {
				isAboveTheFold: true,
				name: 'Test ad 2'
			},
			noAds: true,
			expectedResult: false,
			message: 'Element not added to slot because of noAds property value set to true'
		}, {
			properties: {
				isAboveTheFold: true,
				name: 'Test ad 3'
			},
			noAds: false,
			expectedResult: true,
			message: 'Element added to slot because of noAds property value set to false'
		}];

		testCases.forEach(function (testCase) {
			var component = _this2.subject(),
			    pushSlotSpy = _sinon.default.spy(component.get('ads.module'), 'pushSlotToQueue');

			_this2.ads.set('noAds', testCase.noAds);

			component.setProperties(testCase.properties);
			component.onElementManualInsert();
			component.didEnterViewport();

			assert.equal(pushSlotSpy.called, testCase.expectedResult, testCase.message);

			component.get('ads.module').pushSlotToQueue.restore();
		});
	});
});