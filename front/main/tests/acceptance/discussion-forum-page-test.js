import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';
import mockServiceUrls from 'main/tests/helpers/mock-service-urls';
import destroyApp from 'main/tests/helpers/destroy-app';
import startApp from 'main/tests/helpers/start-app';

moduleForAcceptance('Acceptance | discussion forum page', {
	beforeEach() {
		localStorage.clear();
	}
});
mockServiceUrls();

/**
 * We need to test in a single test run since there's currently a problem with running multiple test cases
 * Tracking ticket: SOC-3565
 */
test('visiting /d results in proper canonical url behavior', (assert) => {
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
