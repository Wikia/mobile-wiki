import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('discussion-editor', 'Unit | Component | discussion editor', {
	unit: true,

	needs: ['service:discussion-editor', 'service:modal-dialog'],
});

test('getLastUrlFromText properly extracts last url from a block of text', function (assert) {
	const component = this.subject(),
		testCases = [
			{
				blockOfText: 'http://fandom.wikia.com',
				expected: 'http://fandom.wikia.com'
			},
			{
				blockOfText: 'http://fandom.wikia.com http://fallout.wikia.com/wiki/Page',
				expected: 'http://fallout.wikia.com/wiki/Page'
			},
			{
				blockOfText: 'There is a text before https://services.wikia.com/discussion and after the url.',
				expected: 'https://services.wikia.com/discussion'
			},
			{
				blockOfText: 'There is no url here.',
				expected: null
			},
		];

	testCases.forEach((testCase) => {
		assert.equal(component.getLastUrlFromText(testCase.blockOfText), testCase.expected);
	});

});
