import {find, findAll} from '@ember/test-helpers';
import Component from '@ember/component';
import {dasherize} from '@ember/string';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import sinon from 'sinon';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import RenderComponentMixin from 'mobile-wiki/mixins/render-component';

const adSlotComponentStub = Component.extend(RenderComponentMixin, {
	classNameBindings: ['nameLowerCase'],
	nameLowerCase: computed('name', function () {
		return dasherize(this.get('name').toLowerCase());
	})
});

module('Unit | Component | article content', function (hooks) {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('component:ad-slot', adSlotComponentStub);
	});

	const mobileTopLeaderboardSelector = '.mobile-top-leaderboard';

	test('ad is injected below portable infobox with no page header', function (assert) {
		run(() => {
			const content =
				'<p>some content</p>' +
				'<aside class="portable-infobox"></aside>' +
				'<section>Article body</section>' +
				'<div>more content</div>',
				setupAdsContextSpy = sinon.spy(),
				component = this.owner.factoryFor('component:article-content').create({
					adsContext: {},
					content,
					setupAdsContext: setupAdsContextSpy
				});

			component.get('ads.module').isLoaded = true;
			this.render();
		});

		assert.equal(findAll(mobileTopLeaderboardSelector).length, 1);
		assert.equal(
			find(mobileTopLeaderboardSelector).previousSibling,
			find('.portable-infobox'),
			'previous element is an infobox'
		);
	});

	test('ad is injected below page header', function (assert) {
		run(() => {
			const content =
				'<p>some content</p>' +
				'<aside class="wiki-page-header"></aside>' +
				'<section>Article body</section>' +
				'<div>more content</div>',
				setupAdsContextSpy = sinon.spy(),
				component = this.owner.factoryFor('component:article-content').create({
					adsContext: {},
					content,
					setupAdsContext: setupAdsContextSpy
				});

			component.get('ads.module').isLoaded = true;
			this.render();
		});

		assert.equal(findAll(mobileTopLeaderboardSelector).length, 1);
		assert.equal(
			find(mobileTopLeaderboardSelector).previousSibling,
			find('.wiki-page-header'),
			'previous element is site header'
		);
	});

	test('ad is injected below portable infobox', function (assert) {
		run(() => {
			const content =
				'<p>some content</p>' +
				'<div class="wiki-page-header"></div>' +
				'<aside class="portable-infobox"></aside>' +
				'<section>Article body</section>' +
				'<div>more content</div>',
				setupAdsContextSpy = sinon.spy(),
				component = this.owner.factoryFor('component:article-content').create({
					adsContext: {},
					content,
					setupAdsContext: setupAdsContextSpy
				});

			component.get('ads.module').isLoaded = true;
			this.render();
		});

		assert.equal(findAll(mobileTopLeaderboardSelector).length, 1, 'top leaderboard is inserted only once');
		assert.equal(
			find(mobileTopLeaderboardSelector).previousSibling,
			find('.portable-infobox'),
			'previous element is an infobox'
		);
	});
});
