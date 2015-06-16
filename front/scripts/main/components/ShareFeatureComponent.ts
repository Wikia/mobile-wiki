/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
/// <reference path="../../../../typings/headroom/headroom.d.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, {
	classNames: ['share-feature'],
	tagName: 'div',
	headroom: null,

	options: {
		// keep it consistent with values in _wikia-variables.scss
		smartBannerHeight: {
			android: 66,
			ios: 83
		}
	},

	offset: Em.computed('smartBannerVisible', function (): number {
		if (this.get('smartBannerVisible')) {
			return this.get('options.smartBannerHeight.' + Mercury.Utils.Browser.getSystem());
		}
		return 0;
	}),

	/**
	 * Observes smartBannerVisible property which is controlled by SmartBannerComponent
	 * and goes through ApplicationController. Reinitializes Headroom when it changes.
	 */
	smartBannerVisibleObserver: Em.observer('smartBannerVisible', function (): void {
		var headroom = this.get('headroom');

		headroom.destroy();
		this.initHeadroom();
	}),

	didInsertElement: function () {
		this.initHeadroom();
	},

	initHeadroom: function (): void {
		var headroom = new Headroom(this.get('element'), {
			classes: {
				initial: 'pinned',
				pinned: 'pinned'
			},
			offset: this.get('offset')
		});

		headroom.init();

		this.set('headroom', headroom);
	},


	lineShare: Em.computed('title', function (): string {
		return "http://line.me/R/msg/text/?" + encodeURIComponent(this.get('title')) + " " + encodeURIComponent(Mercury.wiki.basePath + Mercury.wiki.articlePath + this.get('title'));
	}),

	facebookShare: Em.computed('title', function (): string {
		return "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(Mercury.wiki.basePath + Mercury.wiki.articlePath + this.get('title'));
	}),

	twitterShare: Em.computed('title', function (): string {
		return "https://twitter.com/share?url=" + encodeURIComponent(Mercury.wiki.basePath + Mercury.wiki.articlePath + this.get('title'));
	}),

	googleShare: Em.computed('title', function (): string {
		return "https://plus.google.com/share?url=" + encodeURIComponent(Mercury.wiki.basePath + Mercury.wiki.articlePath + this.get('title'));
	})
});
