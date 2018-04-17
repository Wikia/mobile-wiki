import {inject as service} from '@ember/service';
import {isEmpty} from '@ember/utils';
import {alias, equal, oneWay} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import AlertNotificationsMixin from '../mixins/alert-notifications';

export default Controller.extend(
	AlertNotificationsMixin,
	{
		wikiPage: controller(),
		ads: service(),
		lightbox: service(),
		logger: service(),
		wikiVariables: service(),
		fastboot: service(),

		queryParams: ['file',
			{
				noAds: 'noads'
			},
			{
				mobileApp: 'mobile-app'
			},
			// TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
			{
				commentsPage: 'comments_page'
			}
		],

		applicationWrapperClassNames: null,
		commentsPage: null,
		drawerContent: null,
		drawerVisible: false,
		mobileApp: null,
		userMenuVisible: false,
		rubikFont() {
			const fastboot = this.get('fastboot');
			const shoebox = fastboot.get('shoebox');

			if (fastboot.get('isFastBoot') && fastboot.get('request.cookies.hasRubikFont')) {
				shoebox.put('hasRubikFont', true);
				return 'rubik';
			} else if (!fastboot.get('isFastBoot') && shoebox.retrieve('hasRubikFont')) {
				document.cookie = 'hasRubikFont=true';
				return 'rubik';
			}
		},

		/**
		 * @returns {void}
		 */
		init() {
			this.setProperties({
				applicationWrapperClassNames: [this.rubikFont()],
				domain: this.get('wikiVariables.dbName') ||
				window.location && window.location.href.match(/^https?:\/\/(.*?)\./)[1],
				language: this.get('wikiVariables.language')
			});

			this._super();
		},

		file: alias('lightbox.file'),
		fullPage: oneWay('mobileApp'),
		isSearchPage: equal('currentRouteName', 'search'),
		noAds: alias('ads.noAdsQueryParam'),

		actions: {
			/**
			 * Bubbles up to ApplicationRoute
			 *
			 * @param {HTMLAnchorElement} target
			 * @returns {void}
			 */
			handleLink(target) {
				this.get('target').send('handleLink', target);
			},

			/**
			 * Bubbles up to ApplicationRoute
			 *
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.get('target').send('loadRandomArticle');
			},

			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleDrawer(visible) {
				this.set('drawerVisible', visible);
			},

			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleUserMenu(visible) {
				this.set('userMenuVisible', visible);
			},

			toggleSiteHeadShadow(visible) {
				this.set('siteHeadShadow', visible);
			}
		}
	}
);
