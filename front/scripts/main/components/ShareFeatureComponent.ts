/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, {
	classNames: ['share-feature'],

	title: '',
	sharedUrl: null,

	computedSharedUrl: Em.computed('title', 'sharedUrl', function (): string {
		var sharedUrl: string = this.get('sharedUrl');

		if (Em.isEmpty(sharedUrl)) {
			return Em.getWithDefault(Mercury, 'wiki.basePath', window.location.origin) + window.location.pathname;
		}

		return sharedUrl;
	}),

	lineShare: Em.computed('title', 'computedSharedUrl', function (): string {
		return 'http://line.me/R/msg/text/?' + encodeURIComponent(this.get('title') + ' ' + this.get('computedSharedUrl'));
	}),

	facebookShare: Em.computed('computedSharedUrl', function (): string {
		return 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.get('computedSharedUrl'));
	}),

	twitterShare: Em.computed('computedSharedUrl', function (): string {
		return 'https://twitter.com/share?url=' + encodeURIComponent(this.get('computedSharedUrl'));
	}),

	googleShare: Em.computed('computedSharedUrl', function (): string {
		return 'https://plus.google.com/share?url=' + encodeURIComponent(this.get('computedSharedUrl'));
	}),

	mouseEnter(): void {
		this.attrs.onMouseEnter();
	},

	mouseLeave(): void {
		this.attrs.onMouseLeave();
	}
});
