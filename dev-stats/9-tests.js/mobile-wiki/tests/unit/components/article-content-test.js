define('mobile-wiki/tests/unit/components/article-content-test', ['sinon', 'ember-qunit'], function (_sinon, _emberQunit) {
	'use strict';

	var Component = Ember.Component,
	    dasherize = Ember.String.dasherize,
	    computed = Ember.computed,
	    run = Ember.run,
	    adSlotComponentStub = Component.extend({
		classNameBindings: ['nameLowerCase'],
		nameLowerCase: computed('name', function () {
			return dasherize(this.get('name').toLowerCase());
		})
	});


	(0, _emberQunit.moduleForComponent)('article-content', 'Unit | Component | article content', {
		unit: true,
		needs: ['component:ad-slot', 'component:ads/invisible-high-impact-2', 'component:portable-infobox', 'component:article-table-of-contents', 'service:ads', 'service:currentUser', 'service:fastboot', 'service:i18n', 'service:logger', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			this.register('component:ad-slot', adSlotComponentStub);
		}
	});

	var mobileTopLeaderboardSelector = '.mobile-top-leaderboard';

	(0, _emberQunit.test)('ad is injected below portable infobox with no page header', function (assert) {
		var _this = this;

		run(function () {
			var content = '<p>some content</p>' + '<aside class="portable-infobox"></aside>' + '<section>Article body</section>' + '<div>more content</div>',
			    setupAdsContextSpy = _sinon.default.spy(),
			    component = _this.subject({
				adsContext: {},
				content: content,
				setupAdsContext: setupAdsContextSpy
			});

			component.get('ads.module').isLoaded = true;
			_this.render();
		});

		assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
		assert.equal(this.$(mobileTopLeaderboardSelector).prev().get(0), this.$('.portable-infobox').get(0), 'previous element is an infobox');
	});

	(0, _emberQunit.test)('ad is injected below page header', function (assert) {
		var _this2 = this;

		run(function () {
			var content = '<p>some content</p>' + '<aside class="wiki-page-header"></aside>' + '<section>Article body</section>' + '<div>more content</div>',
			    setupAdsContextSpy = _sinon.default.spy(),
			    component = _this2.subject({
				adsContext: {},
				content: content,
				setupAdsContext: setupAdsContextSpy
			});

			component.get('ads.module').isLoaded = true;
			_this2.render();
		});

		assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
		assert.equal(this.$(mobileTopLeaderboardSelector).prev().get(0), this.$('.wiki-page-header').get(0), 'previous element is site header');
	});

	(0, _emberQunit.test)('ad is injected below portable infobox', function (assert) {
		var _this3 = this;

		run(function () {
			var content = '<p>some content</p>' + '<div class="wiki-page-header"></div>' + '<aside class="portable-infobox"></aside>' + '<section>Article body</section>' + '<div>more content</div>',
			    setupAdsContextSpy = _sinon.default.spy(),
			    component = _this3.subject({
				adsContext: {},
				content: content,
				setupAdsContext: setupAdsContextSpy
			});

			component.get('ads.module').isLoaded = true;
			_this3.render();
		});

		assert.equal(this.$(mobileTopLeaderboardSelector).length, 1, 'top leaderboard is inserted only once');
		assert.equal(this.$(mobileTopLeaderboardSelector).prev().get(0), this.$('.portable-infobox').get(0), 'previous element is an infobox');
	});
});