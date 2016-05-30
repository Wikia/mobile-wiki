import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | curated content editor');

test('visiting /main/edit', (assert) => {
	// https://github.com/ember-cli/ember-cli/issues/3719#issuecomment-111279593
	visit('/');
	visit('/main/edit');

	andThen(() => {
		assert.equal(currentURL(), '/main/edit');

		assert.equal(
			find('.curated-content-editor-block:first .curated-content-editor-row .item-description').text().trim(),
			'Featured item',
			'Featured item is visible'
		);

		assert.equal(
			find('.curated-content-editor-block:nth(1) .curated-content-editor-row .item-description').length,
			2,
			'Both sections are visible'
		);

		assert.equal(
			find('.curated-content-editor-block:nth(1) .curated-content-editor-row:first .title').text().trim(),
			'Section 1',
			'Sections are displayed in correct order'
		);

		assert.equal(
			find('.curated-content-editor-block:nth(2) .curated-content-editor-row .item-description').text().trim(),
			'Optional category',
			'Optional category is visible'
		);
	});
});

test('navigating to section on /main/edit', (assert) => {
	visit('/');
	visit('/main/edit');

	andThen(() => {
		assert.equal(currentURL(), '/main/edit');
	});

	click('.curated-content-editor-block:nth(1) .curated-content-editor-row:first img');

	andThen(() => {
		assert.equal(currentURL(), '/main/edit/section/Section%201', 'Navigate to first section');
		assert.equal(
			find('.curated-content-section-details--label').text(),
			'Section 1',
			'Check section description'
		);
		assert.equal(
			find('.curated-content-section-details--count').text(),
			'app.curated-content-editor-items-count',
			'Check section items count'
		);
		assert.equal(
			find('.curated-content-editor-row').length,
			1,
			'Check section items are displayed'
		);
	});
});
