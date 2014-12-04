moduleForComponent('ad-slot', 'Ad Slot Component', {
	teardown: function () {
		Mercury.Modules.Ads.getInstance().adSlots = [];
	}
});

test('Name lower case', function () {
	var component = this.subject(),
		testCases = [
			{
				name: 'test',
				expected: 'test',
				description: 'No change'
			} , {
				name: 'Test',
				expected: 'test',
				description: 'Lower case'
			} , {
				name: 'Test ',
				expected: 'test-',
				description: 'Trailing space'
			}, {
				name: 'Кирилица с интервали',
				expected: 'кирилица-с-интервали',
				description: 'Cyrillic with spaces'
			}, {
				name: 'ويكيا العربية',
				expected: 'ويكيا-العربية',
				description: 'Arabic'
			}
		];
	Ember.run(function () {
		testCases.forEach(function(testCase) {
			component.set('name', testCase.name);
			equal(component.get('nameLowerCase'), testCase.expected, testCase.description);
		});
	});
});

test('Component behaves correctly depending on noAds value', function () {
	var testCases = [{
			'properties': {
				'name': 'Test ad 1'
			},
			'expectedLength': 1,
			'message': 'Element added to slot because no noAds property was set'
		}, {
			'properties': {
				'name': 'Test ad 2',
				'noAds': '1'
			},
			'expectedLength': 1,
			'message': 'Element not added to slot because of noAds property value'
		}, {
			'properties': {
				'name': 'Test ad 3',
				'noAds': '0'
			},
			'expectedLength': 2,
			'message': 'Element added to slot because of incorrect noAds property value'
		}, {
			'properties': {
				'name': 'Test ad 4',
				'noAds': null
			},
			'expectedLength': 3,
			'message': 'Element added to slot because of null noAds property'
		}, {
			'properties': {
				'name': 'Test ad 5',
				'noAds': 1
			},
			'expectedLength': 3,
			'message': 'Element not added to slot because of integer noAds property'
		}, {
			'properties': {
				'name': 'Test ad 6',
				'noAds': 'abc'
			},
			'expectedLength': 3,
			'message': 'Element not added to slot because of noAds property value'
		}],
		self = this;

	Ember.run(function () {
		testCases.forEach(function(testCase) {
			var component = self.subject();
			component.setProperties(testCase.properties);
			component.didInsertElement();
			equal(Mercury.Modules.Ads.getInstance().adSlots.length, testCase.expectedLength, testCase.message);
		});
	});
});
