import Component from '@ember/component';
import {dasherize} from '@ember/string';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const adSlotComponentStub = Component.extend({
	classNameBindings: ['nameLowerCase'],
	nameLowerCase: computed('name', function () {
		return dasherize(this.get('name').toLowerCase());
	})
});

moduleForComponent('article-content', 'Unit | Component | article content', {
	unit: true,
	needs: [
		'component:ad-slot',
		'component:ads/invisible-high-impact-2',
		'component:portable-infobox',
		'component:article-table-of-contents',
		'service:ads',
		'service:currentUser',
		'service:fastboot',
		'service:i18n',
		'service:logger',
		'service:wiki-variables'
	],

	beforeEach() {
		this.register('component:ad-slot', adSlotComponentStub);
	}
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
			component = this.subject({
				adsContext: {},
				content,
				setupAdsContext: setupAdsContextSpy
			});

		component.get('ads.module').isLoaded = true;
		this.render();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.portable-infobox').get(0),
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
			component = this.subject({
				adsContext: {},
				content,
				setupAdsContext: setupAdsContextSpy
			});

		component.get('ads.module').isLoaded = true;
		this.render();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.wiki-page-header').get(0),
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
			component = this.subject({
				adsContext: {},
				content,
				setupAdsContext: setupAdsContextSpy
			});

		component.get('ads.module').isLoaded = true;
		this.render();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1, 'top leaderboard is inserted only once');
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.portable-infobox').get(0),
		'previous element is an infobox'
	);
});
