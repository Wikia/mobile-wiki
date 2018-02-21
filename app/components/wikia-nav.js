import {inject as service} from '@ember/service';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import {getOwner} from '@ember/application';
import WikiaNavModel from '../models/wikia-nav';
import NoScrollMixin from '../mixins/no-scroll';
import LanguagesMixin from '../mixins/languages';
import UnreadCountMixin from '../mixins/notifications-unread-count';
import {track, trackActions} from '../utils/track';

export default Component.extend(
	NoScrollMixin, UnreadCountMixin, LanguagesMixin,
	{
		currentUser: service(),
		notifications: service(),

		classNames: ['wikia-nav'],
		classNameBindings: ['model.inRoot:wikia-nav--in-root'],

		setDrawerContent() {},

		isUserAuthenticated: oneWay('currentUser.isAuthenticated'),

		init() {
			this._super(...arguments);
			this.model = WikiaNavModel.create(getOwner(this).ownerInjection(), {
				dsGlobalNavigation: this.get('globalNavigation'),
			});
			this.clickHandlers = {
				onRandomPageClick: 'loadRandomArticle'
			};
		},

		didRender() {
			this._super(...arguments);
			this.element.scrollTop = 0;
		},

		actions: {
			/**
			 * Handles link items click, runs handler provided in item object
			 * additionally to tracking and menu reset
			 * @param {Object} item side menu item data
			 * @returns {void}
			 */
			onClick(item) {
				track({
					action: trackActions.click,
					category: item.trackCategory ? item.trackCategory : 'side-nav',
					label: item.trackLabel
				});
				this.get('closeDrawer')();
				// reset state
				this.send('goRoot');
				if (item.actionId) {
					const actionName = this.get(`clickHandlers.${item.actionId}`);

					this.get(actionName)();
				}
			},

			onUsernameClicked() {
				this.send('trackClick', 'side-nav', 'open-user-profile');
				this.get('setDrawerContent')('user-profile');
			},

			goRoot() {
				this.get('model').goRoot();
			},

			goBack() {
				this.get('model').goBack();
			},

			goToSubNav(index) {
				this.get('model').goToSubNav(index);
			},

			goToLogin() {
				this.goToLogin(...arguments);
			},

			/**
			 * wrapper for click tracking
			 *
			 * @param {string} category
			 * @param {string} label
			 * @returns {void}
			 */
			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		},

		/**
		 * Creates a link to a login page preserving current page as a redirect
		 * and adding a language code to the querystring
		 * @returns {void}
		 */
		goToLogin(redirectUrl) {
			track({
				trackingMethod: 'ga',
				action: trackActions.click,
				category: 'user-login-mobile',
				label: 'join-link',
			});

			const url = redirectUrl || window.location.href;

			window.location.href = `/join?redirect=${encodeURIComponent(url)}${this.getUselangParam()}`;
		}
	}
);
