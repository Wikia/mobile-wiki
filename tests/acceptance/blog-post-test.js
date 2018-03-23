import {currentURL, visit, find, findAll} from '@ember/test-helpers';
import {test, module} from 'qunit';
import {setupApplicationTest} from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | Blog post page', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('blog post contains categories', async (assert) => {
		await visit('/');
		await visit('/wiki/User_blog:TimmyQuivy/Bots:_An_Overview_Of_How_They_Are_Used_on_FANDOM');

		assert.ok(find('.wiki-page-header__title'), 'blog title is present');
		assert.equal(
			find('.wiki-page-header__title').textContent,
			'TimmyQuivy/Bots: An Overview Of How They Are Used on FANDOM',
			'blog title is correct'
		);

		assert.ok(find('.wiki-page-header__subtitle'), 'blog subtitle is present');
		assert.equal(find('.wiki-page-header__subtitle').textContent, 'blog-page.subtitle', 'blog i18n key is correct');
		assert.equal(find('.article-content').textContent, 'Test blog page');
		assert.ok(find('.mw-content.collapsible-menu'), 'contains categories');
		assert.equal(findAll('.mw-content.collapsible-menu li').length, 2, 'there are 2 categories');
	});
});

