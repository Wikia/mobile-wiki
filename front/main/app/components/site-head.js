import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, Component} = Ember;

export default Component.extend({
	classNames: ['site-head'],
	classNameBindings: ['themeBar'],
	tagName: 'nav',
	themeBar: false,
	closeIcon: 'close',

	navIcon: computed('drawerContent', 'drawerVisible', function () {
		return this.get('drawerVisible') && this.get('drawerContent') === 'nav' ? 'close' : 'nav';
	}),

	searchIcon: computed('drawerContent', 'drawerVisible', function () {
		return this.get('drawerVisible') && this.get('drawerContent') === 'search' ? 'close' : 'search';
	}),

	actions: {
		/**
		 * @param {String} icon
		 * @returns {void}
		 */
		siteHeadIconClick(icon) {
			if (this.get('drawerVisible') && this.get('drawerContent') === icon) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `${icon}-collapsed`
				});

				this.get('setDrawerContent')(null);
				this.get('toggleDrawer')(false);
			} else {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `${icon}-expanded`
				});

				this.get('setDrawerContent')(icon);
				this.get('toggleDrawer')(true);
			}
		},

		/**
		 * @returns {void}
		 */
		trackWordmarkClick() {
			track({
				action: trackActions.click,
				category: 'wordmark'
			});
		}
	}
});
