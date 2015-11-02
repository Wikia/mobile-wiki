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
			'ja': [
				'facebook',
				'twitter',
				'google',
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
				//'weibo' Until we have an icon for Weibo
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
				'vkontakte',
				'facebook',
				'odnoklassniki',
				'twitter'
			],
			'pl': [
				'facebook',
				'twitter',
				'nk',
				'wykop'
			]
		},

		computedSharedUrl: Em.computed('title', 'sharedUrl', function ():string {
			var sharedUrl:string = this.get('sharedUrl');

			if (Em.isEmpty(sharedUrl)) {
				return Em.getWithDefault(Mercury, 'wiki.basePath', window.location.origin) + window.location.pathname;
			}

			return sharedUrl;
		}),

		currentSocialNetworks: Em.computed('currentUser.language', function ():string[] {
			var lang = this.getBrowserLanguage(),
				socialNetworks = this.get('socialNetworks');
			return socialNetworks[lang] || socialNetworks['en'];
		}),

		line():string {
			return 'http://line.me/R/msg/text/?' + encodeURIComponent(this.get('title') + ' ' +
				this.get('computedSharedUrl'));
		},

		facebook():string {
			return 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.get('computedSharedUrl'));
		},

		twitter():string {
			return 'https://twitter.com/share?url=' + encodeURIComponent(this.get('computedSharedUrl'));
		},

		google():string {
			return 'https://plus.google.com/share?url=' + encodeURIComponent(this.get('computedSharedUrl'));
		},

		reddit():string {
			return 'http://www.reddit.com/submit?url=' + encodeURIComponent(this.get('computedSharedUrl')) + '&title=' +
				encodeURIComponent(this.get('title'));
		},

		tumblr():string {
			return 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(this.get('computedSharedUrl')) + '&name=' +
				encodeURIComponent(this.get('title'));
		},

		weibo():string {
			return 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(this.get('computedSharedUrl')) +
				'&title=' + encodeURIComponent(this.get('title'));
		},

		vkontakte():string {
			return 'http://vk.com/share.php?url=' + encodeURIComponent(this.get('computedSharedUrl')) + '&title=' +
				encodeURIComponent(this.get('title'));
		},

		odnoklassniki():string {
			return 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=' +
				encodeURIComponent(this.get('computedSharedUrl'));
		},

		nk():string {
			return 'http://nk.pl/sledzik?shout=' + encodeURIComponent(this.get('computedSharedUrl'));
		},

		wykop():string {
			return 'http://www.wykop.pl/dodaj/link/?url=' + encodeURIComponent(this.get('computedSharedUrl')) + '&title=' +
				encodeURIComponent(this.get('title'));
		},

		meneame():string {
			return 'https://www.meneame.net/submit.php?url=' + encodeURIComponent(this.get('computedSharedUrl'));
		},

		actions: {
			/**
			 * Obtains a shared url getter and executes it to get a shared url with a current page details
			 * In this case, handler should be named after the string in the config object at the top of the file
			 * @param {string} network
			 */
			share(network: string):void {
				var urlGetter:Function = this.get(network),
					link:string;

				if (typeof urlGetter !== 'function') {
					Em.Logger.warn('Shared Url getter for ' + network + ' does not exist');
					return;
				}

				link = urlGetter.bind(this)();

				if (typeof link === 'string') {
					window.open(link);
				}
			}
		},

		/**
		 * @returns {undefined}
		 */
		mouseEnter(): void {
			if (this.attrs && typeof this.attrs.onMouseEnter === 'function') {
				this.attrs.onMouseEnter();
			}
		},

		/**
		 * @returns {undefined}
		 */
		mouseLeave(): void {
			if (this.attrs && typeof this.attrs.onMouseLeave === 'function') {
				this.attrs.onMouseLeave();
			}
		},
	}
);
