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

function createElement(tag, className) {
	const element = document.createElement(tag),
		parent = document.createElement('div');

	element.className = className;
	parent.appendChild(element);

	return element;
}

test('shouldHandleClick returns correct value', function (assert) {
	const testCases = [
		{
			target: createElement('li', 'mw-content'),
			expected: true
		},
		{
			target: createElement('li'),
			expected: null
		},
		{
			target: createElement('div', 'PDS_Poll'),
			expected: null
		}
	];

	testCases.forEach((testCase) => {
		const component = this.subject();

		assert.equal(component.shouldHandleClick(testCase.target), testCase.expected);
	});
});
