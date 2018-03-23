import {currentURL, visit, find, findAll} from '@ember/test-helpers';
import {test, module} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import sinon from 'sinon';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | article page', (hooks) => {
	setupApplicationTest(hooks);

	const originalImage = window.Image;

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
		window.Image = sinon.stub();
	});

	hooks.afterEach(() => {
		window.Image = originalImage;
	});

	test('visiting Article Page', async (assert) => {
		await visit('/');
		await visit('/wiki/Test');
		assert.ok(true)
		debugger;
	});
});

