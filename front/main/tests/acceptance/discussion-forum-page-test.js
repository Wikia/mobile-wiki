import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';
import mockServiceUrls from 'main/tests/helpers/mock-service-urls';

moduleForAcceptance('Acceptance | discussion forum page');
mockServiceUrls();

test('visiting /main/edit', (assert) => {
	// https://github.com/ember-cli/ember-cli/issues/3719#issuecomment-111279593
	visit('/');
	visit('/d');

	andThen(() => {
		assert.equal(currentURL(), '/d/f?sort=trending');
	});
});
