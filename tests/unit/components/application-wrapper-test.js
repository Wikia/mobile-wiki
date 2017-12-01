import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('application-wrapper', 'Unit | Component | application wrapper', {
	unit: true,
	needs: [
		'service:ads',
		'service:current-user',
		'service:fastboot',
		'service:logger',
		'service:wiki-variables',
		'service:smartBanner'
	]
});

test('shouldHandleClick returns correct value', function (assert) {
	const testCases = [
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

	testCases.forEach((testCase) => {
		const component = this.subject();

		assert.equal(component.shouldHandleClick(testCase.target), testCase.expected);
	});
});
