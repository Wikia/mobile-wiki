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
			name: 'Кирилица с интервали',
			expected: 'кирилица-с-интервали',
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

test('behaves correctly depending on noAds value', function (assert) {
	const testCases = [{
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
		}],
		offset = require('common/modules/ads').default.getInstance().adSlots.length;

	testCases.forEach((testCase) => {
		const component = this.subject();

		component.setProperties(testCase.properties);
		component.didInsertElement();
		assert.equal(
			require('common/modules/ads').default.getInstance().adSlots.length,
			testCase.expectedLength + offset,
			testCase.message
		);
	});
});
