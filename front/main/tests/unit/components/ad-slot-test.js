import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('ad-slot', 'Unit | Component | ad slot', {
	unit: true
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
				name: 'Test ad 1'
			},
			expectedLength: 1,
			message: 'Element added to slot because no noAds property was passed'
		}, {
			properties: {
				name: 'Test ad 2',
				noAds: ''
			},
			expectedLength: 2,
			message: 'Element added to slot because of noAds property value set to an empty string'
		}, {
			properties: {
				name: 'Test ad 3',
				noAds: '0'
			},
			expectedLength: 3,
			message: 'Element added to slot because of noAds property value set to \'0\''
		}, {
			properties: {
				name: 'Test ad 4',
				noAds: 'false'
			},
			expectedLength: 3,
			message: 'Element not added to slot because of noAds property value set to \'false\''
		}, {
			properties: {
				name: 'Test ad 5',
				noAds: 'whatever'
			},
			expectedLength: 3,
			message: 'Element not added to slot because of noAds property value set to \'whatever\''
		}, {
			properties: {
				name: 'Test ad 6',
				noAds: '1'
			},
			expectedLength: 3,
			message: 'Element not added to slot because of noAds property value set to \'1\''
		}, {
			properties: {
				name: 'Test ad 7',
				noAds: 'true'
			},
			expectedLength: 3,
			message: 'Element not added to slot because of noAds property value set to \'true\''
		}
	];

	testCases.forEach((testCase) => {
		const component = this.subject();

		component.setProperties(testCase.properties);
		component.onElementManualInsert();
		component.didEnterViewport();
		assert.equal(
			require('common/modules/ads').default.getInstance().adSlots.length,
			testCase.expectedLength,
			testCase.message
		);
	});
});
