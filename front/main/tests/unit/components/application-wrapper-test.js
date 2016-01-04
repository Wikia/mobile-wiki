import {test, moduleFor} from 'ember-qunit';

moduleFor('component:application-wrapper', {
	unit: true
});

test('shouldHandleClick returns correct value', function () {
	var component = this.subject(),
		testCases = [
			{
				target: '<li class="mw-content"></li>',
				expected: true
			},
			{
				target: '<li></li>',
				expected: false
			},
			{
				target: '<div class="PDS_Poll"></div>',
				expected: false
			}
		];

	Ember.run(function () {
		testCases.forEach(function(testCase) {
			equal(component.shouldHandleClick(testCase.target), testCase.expected);
		});
	});
});
