import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import WikiaNavModel from '../models/wikia-nav';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		init() {
			this._super(...arguments);
			this.model = WikiaNavModel.create();
		},

		currentUser: Ember.inject.service(),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

		logoutLink: M.buildUrl({
			namespace: 'Special',
			title: 'UserLogout'
		}),

		userProfileLink: Ember.computed('currentUser.name', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name')
			});
		}),

		actions: {
			onClick(item) {
				track({
					action: trackActions.click,
					category: item.trackCategory ? item.trackCategory : 'side-nav',
					label: item.trackLabel
				});
				this.get('toggleDrawer')(false);
				// reset state
				this.send('goRoot');
				if (item.clickHandler) {
					this.get(item.clickHandler)();
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
