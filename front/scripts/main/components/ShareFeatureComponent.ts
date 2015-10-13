/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/LanguagesMixin.ts" />
/// <reference path="../../main/mixins/TrackClickMixin.ts" />
'use strict';

App.ShareFeatureComponent = Em.Component.extend(App.TrackClickMixin, App.LanguagesMixin, {
	classNames: ['share-feature'],

	title: '',
	sharedUrl: null,

	currentSocialNetworks: [],

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
			'nk',
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

			this.setCurrentSocialNetworks();
		}
		this._super();
	},

	setCurrentSocialNetworks(): void {
		var lang = this.getLanguage(),
			socialNetworks = this.get('socialNetworks'),
			currentSocialNetworks = socialNetworks[lang] ? socialNetworks[lang] : socialNetworks['en'];

		this.set('currentSocialNetworks', currentSocialNetworks);
	},

	line(): string {
		return 'http://line.me/R/msg/text/?' + encodeURIComponent(this.get('title') + ' ' + this.get('sharedUrl'));
	},

	facebook(): string {
		return 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.get('sharedUrl'));
	},

	twitter(): string {
		return 'https://twitter.com/share?url=' + encodeURIComponent(this.get('sharedUrl'));
	},

	google(): string {
		return 'https://plus.google.com/share?url=' + encodeURIComponent(this.get('sharedUrl'));
	},

	reddit(): string {
		return 'http://www.reddit.com/submit?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	},

	tumblr(): string {
		return 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(this.get('sharedUrl')) + '&name='
			+ encodeURIComponent(this.get('title'));
	},

	weibo(): string {
		return 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	},

	vk(): string {
		return 'http://vk.com/share.php?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	},

	odnoklassniki(): string {
		return 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl='
			+ encodeURIComponent(this.get('sharedUrl'));
	},

	nk(): string {
		return 'http://nk.pl/sledzik?shout=' + encodeURIComponent(this.get('sharedUrl'));
	},

	wykop(): string {
		return 'http://www.wykop.pl/dodaj/link/?url=' + encodeURIComponent(this.get('sharedUrl')) + '&title='
			+ encodeURIComponent(this.get('title'));
	},

	meneame(): string {
		return 'https://www.meneame.net/submit.php?url=' + encodeURIComponent(this.get('sharedUrl'));
	},

	actions: {
		share: function (network: string): void {
			var urlGetter: Function = this.get(network),
				link: string;

			if (typeof urlGetter !== 'function') {
				return;
			}

			link = urlGetter.bind(this)();

			if (typeof link === 'string') {
				window.open(link);
			}
		}
	}
});
