/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, {
	classNames: ['share-feature'],

	title: '',
	sharedUrl: null,

	socialNetworks: {
		'en': [
			'facebook',
			'twitter',
			'reddit',
			'tumblr'
		],
		'jp': [
			'facebook',
			'twitter',
			'g+',
			'line'
		],
		'pt-br': [
			'facebook',
			'twitter',
			'reddit',
			'tumblr'
		],
		'zh': [
			'facebook',
			'weibo'
		],
		'de': [
			'facebook',
			'twitter',
			'tumblr'
		],
		'fr': [
			'facebook',
			'twitter'
		],
		'es': [
			'facebook',
			'twitter',
			'meneame',
			'tumblr'
		],
		'ru': [
			'vk',
			'facebook',
			'odnoklassniki'
		],
		'pl': [
			'facebook',
			'twitter',
			'nk.pl',
			'wykop'
		]
	},

	didInsertElement: function (): void {
		if (this.get('sharedUrl') === null) {
			// If not set, the shared URL is the current page
			this.set('sharedUrl', Em.computed('title', function (): string {
				return Em.getWithDefault(Mercury, 'wiki.basePath',
					window.location.origin) + window.location.pathname;
			}));
		}
		this._super();
	},

	currentSocialNetworks: Em.computed(function () {
		var lang = this.getLanguage(),
			socialNetworks= this.get('socialNetworks');
		return socialNetworks[lang] ? socialNetworks[lang] : socialNetworks['en'] ;
	}),

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
	}),

	redditShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://www.reddit.com/submit?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	}),

	tumblrShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(this.get('sharedUrl')) + '&name='
			+ encodeURIComponent(this.get('title'));
	}),

	weiboShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	}),

	vkShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://vk.com/share.php?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	}),

	ondoklassnikiShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl='
			+ encodeURIComponent(this.get('sharedUrl'));
	}),

	nkShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'http://nk.pl/sledzik?shout=' + encodeURIComponent(this.get('sharedUrl'));
	}),

	wykopShare: Em.computed('title', 'sharedUrl', function (): string {
		return ' http://www.wykop.pl/dodaj/link/?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	}),

	meneameShare: Em.computed('title', 'sharedUrl', function (): string {
		return 'https://www.meneame.net/submit.php?url=' + encodeURIComponent(this.get('sharedUrl'));
	})
});
