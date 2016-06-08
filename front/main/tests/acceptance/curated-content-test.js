import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Curated Main Page', {
	afterEach() {
		resetAds();
	}
});

test('Open Curated Main Page then open Section and finally open Category', (assert) => {
	// https://github.com/ember-cli/ember-cli/issues/3719#issuecomment-111279593
	visit('/');
	visit('/wiki/Mercury_CC_Wikia');

	andThen(() => {
		assert.equal(currentURL(), '/wiki/Mercury_CC_Wikia', 'Url is correct: /wiki/Mercury_CC_Wikia');

		assert.equal(
			find('.item-caption.clamp:first').text(),
			'Categories',
			'Curated Content section \'Categories\' is visible'
		);

		click('.item-caption.clamp:first');
	});

	andThen(() => {
		assert.equal(currentURL(), '/main/section/Categories', 'Url is correct: /main/section/Categories');

		assert.equal(
			find('.item-caption.clamp:first').text(),
			'Articles label',
			'Curated Content category \'Articles label\' is visible'
		);

		click('.item-caption.clamp:first');
	});

	andThen(() => {
		assert.equal(currentURL(), '/main/category/Articles', 'Url is correct: /main/category/Articles');

		assert.equal(
			find('.item-caption.clamp:first').text(),
			'Green article',
			'Curated Content category item \'Green article\' is visible'
		);
	});
});
