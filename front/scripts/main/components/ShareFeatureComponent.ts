/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, App.HeadroomMixin, {
	classNames: ['share-feature'],
	headroomOptions: {
		classes: {
			initial: 'pinned',
			pinned: 'pinned'
		}
	},

	sharedUrl: Em.computed('controllers.application.title', function (): string {
			return Em.getWithDefault(Mercury, 'wiki.basePath', window.location.origin) + window.location.pathname;
		}
	),

	lineShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://line.me/R/msg/text/?' + encodeURIComponent(this.get('title') + ' ' + this.get('sharedUrl'));
	}),

	facebookShare: Em.computed('sharedUrl', function (): string {
		return 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.get('sharedUrl'));
	}),

	twitterShare: Em.computed('sharedUrl', function (): string {
		return 'https://twitter.com/share?url=' + encodeURIComponent(this.get('sharedUrl'));
	}),

	googleShare: Em.computed('sharedUrl', function (): string {
		return 'https://plus.google.com/share?url=' + encodeURIComponent(this.get('sharedUrl'));
	})
});
