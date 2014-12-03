moduleForComponent('ad-slot');

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

test('Component is inserted on page', function () {
	var component = this.subject();
	component.set('name', 'Test ad 1');
	this.append();
	equal(Mercury.Modules.Ads.getInstance().adSlots.length, 1, 'Element added to slot');
});
