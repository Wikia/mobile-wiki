import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import WikiaNavModel from '../models/wikia-nav';
import {track, trackActions} from 'common/utils/track';

const {Component, computed, inject} = Ember;

export default Component.extend(
	LoginLinkMixin,
	{
		classNameBindings: ['model.inRoot:wikia-nav--in-root'],
		currentUser: inject.service(),
		isUserAuthenticated: computed.oneWay('currentUser.isAuthenticated'),

		logoutLink: M.buildUrl({
			namespace: 'Special',
			title: 'UserLogout'
		}),

		userProfileLink: computed('currentUser.name', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name')
			});
		}),

		init() {
			this._super(...arguments);
			this.model = WikiaNavModel.create();
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

			goRoot() {
				this.get('model').goRoot();
			},

			goBack() {
				this.get('model').goBack();
			},

			goToSubNav(index) {
				this.get('model').goToSubNav(index);
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
		}
	}
);
