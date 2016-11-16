import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';
import mockServiceUrls from 'main/tests/helpers/mock-service-urls';
import destroyApp from 'main/tests/helpers/destroy-app';
import startApp from 'main/tests/helpers/start-app';

moduleForAcceptance('Acceptance | discussion forum page', {
	beforeEach() {
		localStorage.clear();
	},

	afterEach() {
	}
});
mockServiceUrls();

test('visiting /d results in a redirect + adding default sort to the url', (assert) => {
	// https://github.com/ember-cli/ember-cli/issues/3719#issuecomment-111279593
	visit('/');
	visit('/d');

	andThen(() => {
		const suffix = '?sort=latest',
			canonicalHref = find('link[rel=canonical]', 'head').attr('href');

		assert.ok(
			canonicalHref.indexOf(suffix, canonicalHref.length - suffix.length) !== -1,
		);
		assert.equal(currentURL(), '/d/f?sort=trending');

		click('.load-more-button');

		andThen(() => {
			const canonicalLink = find('link[rel=canonical]', 'head');

			assert.equal(
				canonicalLink.length,
				0
			);
		});
	});
});
