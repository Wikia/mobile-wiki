import { currentURL, visit, find, findAll } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | file page', (hooks) => {
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

	test('visiting File Page', async (assert) => {
		await visit('/');
		await visit('/wiki/File:Example.jpg');

		assert.equal(currentURL(), '/wiki/File:Example.jpg');
		assert.ok(find('.article-media-thumbnail img'), 'Hero image is visible');
		assert.ok(find('.file-usage__header'), 'Appears on header is visible');
		assert.ok(find('.file-usage__more a'), 'Appears on see more link is visible');
		assert.equal(find('.file-usage__more a').getAttribute('href'), '/wiki/Special:WhatLinksHere/File:Example.jpg');
		assert.equal(findAll('.file-usage__list .wikia-card').length, 1, 'Appears on had right number of items');
	});
});
