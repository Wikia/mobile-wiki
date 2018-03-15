import {find, findAll, fillIn, triggerEvent, visit, currentURL} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {module, test} from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | Head meta tags', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('check basic meta tags', async (assert) => {
		await visit('/');

		// This is a bit hacky, but test runs do not have their own 'head' that is why We have to test if a test run
		// set something in head of a test runner document
		assert.equal(document.querySelectorAll('meta[name="viewport"]')[1]
			.getAttribute('content'), 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, minimal-ui');
		assert.equal(document.querySelector('meta[name="theme-color"]')
			.getAttribute('content'), '#94d11f');
	});
});
