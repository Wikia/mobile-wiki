import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | Curated Main Page', {
	beforeEach() {
		sinon.stub(require('common/modules/ads').default.getInstance(), 'removeSlot');
	},
});

test('Open section on Curated Main Page', (assert) => {
	const firstVisibleItemSelector = '.curated-content-items:visible .item-caption.clamp:first';

	// https://github.com/ember-cli/ember-cli/issues/3719#issuecomment-111279593
	visit('/');
	visit('/wiki/Mercury_CC_Wikia');

	andThen(() => {
		assert.equal(currentURL(), '/wiki/Mercury_CC_Wikia', 'Url is correct: /wiki/Mercury_CC_Wikia');
		assert.equal(
			find(firstVisibleItemSelector).text(),
			'Categories',
			'Section \'Categories\' is visible'
		);

		click(firstVisibleItemSelector);
	});

	andThen(() => {
		assert.equal(
			find(firstVisibleItemSelector).text(),
			'Articles label',
			'Section was opened and its first item has correct label'
		);
		assert.equal(
			find(firstVisibleItemSelector).closest('a').attr('href'),
			'/wiki/Category:Articles',
			'Section was opened and its first item is a link to a category page'
		);
	});
});
