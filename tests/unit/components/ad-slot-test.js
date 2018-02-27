import Service from '@ember/service';
import {run} from '@ember/runloop';
import sinon from 'sinon';
import require from 'require';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

const adsStub = Service.extend({
	module: require('mobile-wiki/modules/ads').default.getInstance()
});

module('Unit | Component | ad slot', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('service:ads', adsStub);
		this.ads = this.owner.lookup('service:ads');
	});

	test('Name lower case', function (assert) {
		const testCases = [
			{
				name: 'test',
				expected: 'test',
				description: 'No change'
			},
			{
				name: 'Test',
				expected: 'test',
				description: 'Lower case'
			},
			{
				name: 'Test ',
				expected: 'test-',
				description: 'Trailing space'
			},
			{
				name: 'Кириллица с пробелами',
				expected: 'кириллица-с-пробелами',
				description: 'Cyrillic with spaces'
			},
			{
				name: 'ويكيا العربية',
				expected: 'ويكيا-العربية',
				description: 'Arabic'
			}
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
				eventName: 'wikia.uap',
				callTwice: false,
				uapCallbackCount: 1,
				noUapCallbackCount: 0,
				message: 'uap callback called once'
			},
			{
				eventName: 'wikia.not_uap',
				callTwice: false,
				uapCallbackCount: 0,
				noUapCallbackCount: 1,
				message: 'no uap callback called once'
			},
			{
				eventName: 'wikia.uap',
				callTwice: true,
				uapCallbackCount: 2,
				noUapCallbackCount: 0,
				message: 'uap callback called twice'
			},
			{
				eventName: 'wikia.not_uap',
				callTwice: true,
				uapCallbackCount: 0,
				noUapCallbackCount: 2,
				message: 'no uap callback called twice'
			}
		];

		testCases.forEach((testCase) => {
			const Ads = require('mobile-wiki/modules/ads').default,
				ads = new Ads(),
				spyUap = sinon.spy(),
				spyNoUap = sinon.spy();

			ads.waitForUapResponse(spyUap, spyNoUap);
			window.dispatchEvent(new Event(testCase.eventName));

			if (testCase.callTwice) {
				ads.waitForUapResponse(spyUap, spyNoUap);
			}

			assert.equal(testCase.uapCallbackCount, spyUap.callCount, testCase.message);
			assert.equal(testCase.noUapCallbackCount, spyNoUap.callCount, testCase.message);
		});
	});

	test('behaves correctly depending on noAds value', function (assert) {
		const testCases = [
			{
				properties: {
					isAboveTheFold: true,
					name: 'Test ad 1'
				},
				expectedResult: true,
				message: 'Element added to slot because no noAds property was passed'
			}, {
				properties: {
					isAboveTheFold: true,
					name: 'Test ad 2',
				},
				noAds: true,
				expectedResult: false,
				message: 'Element not added to slot because of noAds property value set to true'
			}, {
				properties: {
					isAboveTheFold: true,
					name: 'Test ad 3',
				},
				noAds: false,
				expectedResult: true,
				message: 'Element added to slot because of noAds property value set to false'
			}
		];

		testCases.forEach((testCase) => {
			const component = this.owner.factoryFor('component:ad-slot').create(),
				pushSlotSpy = sinon.spy(component.get('ads.module'), 'pushSlotToQueue');

			this.ads.set('noAds', testCase.noAds);

			component.setProperties(testCase.properties);
			run(() => {
				component.didInsertElement();
				component.didEnterViewport();
			});

			assert.equal(
				pushSlotSpy.called,
				testCase.expectedResult,
				testCase.message
			);

			component.get('ads.module').pushSlotToQueue.restore();
		});
	});
});
