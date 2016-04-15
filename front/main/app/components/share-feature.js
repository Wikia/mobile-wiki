import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import LanguagesMixin from '../mixins/languages';

export default Ember.Component.extend(
	TrackClickMixin,
	LanguagesMixin,
	{
		classNames: ['share-feature'],

		currentUser: Ember.inject.service(),

		title: '',
		sharedUrl: null,

		socialNetworks: {
			en: [
				'facebook',
				'twitter',
				'reddit',
				'tumblr'
			],
			ja: [
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
			zh: [
				'facebook',
				'weibo'
			],
			de: [
				'facebook',
				'twitter',
				'tumblr'
			],
			fr: [
				'facebook',
				'twitter'
			],
			es: [
				'facebook',
				'twitter',
				'meneame',
				'tumblr'
			],
			ru: [
				'vkontakte',
				'facebook',
				'odnoklassniki',
				'twitter'
			],
			pl: [
				'facebook',
				'twitter',
				'nk',
				'wykop'
			]
		},

		computedSharedUrl: Ember.computed('title', 'sharedUrl', function () {
			const sharedUrl = this.get('sharedUrl');

			if (Ember.isEmpty(sharedUrl)) {
				return Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin) + window.location.pathname;
			}

			return sharedUrl;
		}),

		currentSocialNetworks: Ember.computed('currentUser.language', function () {
			const lang = this.getBrowserLanguage(),
				socialNetworks = this.get('socialNetworks');

			return socialNetworks[lang] || socialNetworks.en;
		}),

		/**
		 * link generator for sharing a url on line
		 * @returns {string}
		 */
		line() {
			return `http://line.me/R/msg/text/?` +
				`${encodeURIComponent(
					`${this.get('title')} ${this.get('computedSharedUrl')}`
				)}`;
		},

		/**
		 * link generator for sharing a url on facebook
		 * @returns {string}
		 */
		facebook() {
			return `http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		/**
		 * link generator for sharing a url on twitter
		 * @returns {string}
		 */
		twitter() {
			return `https://twitter.com/share?url=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		/**
		 * link generator for sharing a url on google
		 * @returns {string}
		 */
		google() {
			return `https://plus.google.com/share?url=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		/**
		 * link generator for sharing a url on reddit
		 * @returns {string}
		 */
		reddit() {
			return `http://www.reddit.com/submit` +
				`?url=${encodeURIComponent(this.get('computedSharedUrl'))}` +
				`&title=${encodeURIComponent(this.get('title'))}`;
		},

		/**
		 * link generator for sharing a url on tumblr
		 * @returns {string}
		 */
		tumblr() {
			return `http://www.tumblr.com/share/link` +
				`?url=${encodeURIComponent(this.get('computedSharedUrl'))}` +
				`&name=${encodeURIComponent(this.get('title'))}`;
		},

		/**
		 * link generator for sharing a url on weibo
		 * @returns {string}
		 */
		weibo() {
			return `http://service.weibo.com/share/share.php` +
				`?url=${encodeURIComponent(this.get('computedSharedUrl'))}` +
				`&title=${encodeURIComponent(this.get('title'))}`;
		},

		/**
		 * link generator for sharing a url on vkontakte
		 * @returns {string}
		 */
		vkontakte() {
			return `http://vk.com/share.php` +
				`?url=${encodeURIComponent(this.get('computedSharedUrl'))}` +
				`&title=${encodeURIComponent(this.get('title'))}`;
		},

		/**
		 * link generator for sharing a url on odnoklassniki
		 * @returns {string}
		 */
		odnoklassniki() {
			return `http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1` +
				`&st._surl=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		/**
		 * link generator for sharing a url on nk
		 * @returns {string}
		 */
		nk() {
			return `http://nk.pl/sledzik?shout=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		/**
		 * link generator for sharing a url on wykop
		 * @returns {string}
		 */
		wykop() {
			return `http://www.wykop.pl/dodaj/link/` +
				`?url=${encodeURIComponent(this.get('computedSharedUrl'))}` +
				`&title=${encodeURIComponent(this.get('title'))}`;
		},

		/**
		 * link generator for sharing a url on meneame
		 * @returns {string}
		 */
		meneame() {
			return `https://www.meneame.net/submit.php?url=${encodeURIComponent(this.get('computedSharedUrl'))}`;
		},

		actions: {
			/**
			 * Obtains a shared url getter and executes it to get a shared url with a current page details
			 * In this case, handler should be named after the string in the config object at the top of the file
			 * @param {string} network
			 * @returns {void}
			 */
			share(network) {
				const urlGetter = this.get(network);

				let link;

				this.trackClick('share', network);

				if (typeof urlGetter !== 'function') {
					Ember.Logger.warn(`Shared Url getter for ${network} does not exist`);
					return;
				}

				link = urlGetter.bind(this)();

				if (typeof link === 'string') {
					window.open(link);
				}
			}
		},
	}
);
