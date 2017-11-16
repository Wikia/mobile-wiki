import {test, moduleFor} from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
	unit: true,
	needs: [
		'controller:wiki-page',
		'service:ads',
		'service:current-user',
		'service:fastboot',
		'service:logger',
		'service:wiki-variables',
		'service:scheduler',
		'service:router-scroll'
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
		const applicationController = this.subject();

		assert.equal(applicationController.shouldHandleClick(testCase.target), testCase.expected);
	});
});
