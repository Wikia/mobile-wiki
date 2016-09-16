import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const adsStub = Ember.Service.extend({
	module: require('common/modules/ads').default.getInstance()
});

moduleForComponent('ad-slot', 'Unit | Component | ad slot', {
	unit: true,
	beforeEach() {
		this.register('service:ads', adsStub);
		this.inject.service('ads', {as: 'ads'});
	}
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
		const component = this.subject();

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
		const Ads = require('common/modules/ads').default,
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
		const component = this.subject(),
			addSlotSpy = sinon.spy(component.get('ads.module'), 'addSlot');

		this.ads.set('noAds', testCase.noAds);

		component.setProperties(testCase.properties);
		component.onElementManualInsert();
		component.didEnterViewport();

		assert.equal(
			addSlotSpy.called,
			testCase.expectedResult,
			testCase.message
		);

		component.get('ads.module').addSlot.restore();
	});
});
