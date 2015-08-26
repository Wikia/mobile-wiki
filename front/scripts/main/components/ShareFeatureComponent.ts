/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
/// <reference path="../../../../typings/headroom/headroom.d.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, App.HeadroomMixin, {
	classNames: ['share-feature'],
	tagName: 'div',

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
