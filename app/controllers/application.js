import {inject as service} from '@ember/service';
import {isEmpty} from '@ember/utils';
import {alias, equal, oneWay} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import NoScrollMixin from '../mixins/no-scroll';

export default Controller.extend(
	AlertNotificationsMixin,
	NoScrollMixin,
	{
		wikiPage: controller(),
		ads: service(),
		logger: service(),
		wikiVariables: service(),

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

		/**
		 * @returns {void}
		 */
		init() {
			this.setProperties({
				applicationWrapperClassNames: [],
				domain: this.get('wikiVariables.dbName') ||
				window.location && window.location.href.match(/^https?:\/\/(.*?)\./)[1],
				language: this.get('wikiVariables.language')
			});

			this._super();
		},

		applicationWrapperClassNames: null,
		commentsPage: null,
		drawerContent: null,
		drawerVisible: false,
		file: null,
		mobileApp: null,
		userMenuVisible: false,

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
			 * Sets query param with given name to given value. Uses whitelist.
			 *
			 * @param {string} name
			 * @param {*} value
			 * @returns {void}
			 */
			setQueryParam(name, value) {
				if (name !== 'file') {
					this.get('logger').error('Something tried to set query param that is not on the whitelist', {
						name,
						value,
						whitelist: ['file']
					});
					return;
				}

				this.set(name, value);
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
