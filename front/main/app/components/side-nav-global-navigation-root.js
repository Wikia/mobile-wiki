import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
		localLinks: Ember.get(Mercury, 'wiki.navigation2016.localNav'),
		exploreWikiaLinks: Ember.get(Mercury, 'wiki.navigation2016.exploreWikiaMenu'),
		exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
		state: [],
		items: Ember.computed('state.[]', function () {
			const s = this.get('state');
			if (s.length > 0 && !s[0]) {
				// special case for exploration nav
				return this.prepareExplorationItems();
			}
			// subNav, show only local
			if (s.length > 0) {
				return this.prepareLocalItems(s);
			}
			// if state == []
			return this.prepareGlobalItems().concat(this.prepareLocalItems([]));
		}),
		header: Ember.computed('state.[]', function () {
			let nav = this.get('localLinks'),
				header = this.get('exploreWikiaLabel');

			for(let i of this.get('state')) {
				if (nav[i-1]) {
					header = nav[i-1].text;
				}
				nav = nav[i-1] ? nav[i-1].children : nav;
			}
			return header;
		}),
		shouldDisplayHeader: Ember.computed('state.[]', function () {
			return Boolean(this.get('state').length);
		}),

		newFeaturesBadges: Ember.inject.service(),
		shouldDisplayNewBadge: Ember.computed('newFeaturesBadges.features.[]', function () {
			return this.get('newFeaturesBadges').shouldDisplay('recent-wiki-activity');
		}),

		currentUser: Ember.inject.service(),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

		logoutLink: M.buildUrl({
			namespace: 'Special',
			title: 'UserLogout',
		}),

		userProfileLink: Ember.computed('currentUser.name', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name')
			});
		}),

		prepareExplorationItems() {
			return this.get('exploreWikiaLinks')
				.map(function (item) {
					return {
						type: 'side-nav-menu-item',
						//TODO: add route with link
						href: item.href,
						name: item.textEscaped,
						trackLabel: `open-${item.trackingLabel}`
					};
				});
		},

		prepareGlobalItems() {
			return [{
				type: 'side-nav-menu-header',
				name: this.get('exploreWikiaLabel')
			}].concat(this.get('hubsLinks').map(function (item) {
				return {
					type: 'side-nav-menu-item',
					className: item.specialAttr,
					// TODO: add route with link
					href: item.href,
					name: item.textEscaped,
					trackLabel: `open-hub-${item.specialAttr}`
				};
			})).concat([{
				// add exploration item
				type: 'side-nav-menu-item',
				children: true,
				index: 0,
				name: this.get('exploreWikiaLabel'),
				trackLabel: 'open-explore-wikia'
			}]);
		},

		prepareLocalItems(state) {
			let nav = this.get('localLinks'),
				index = 0,
				local = [];

			if (state.length > 0) {
				// look for correct subnav
				for(let i of state) {
					nav = nav[i-1] ? nav[i-1].children : nav;
				}
			} else {
				local = [{
					//header
					type: 'side-nav-menu-header',
					name: i18n.t('app.explore-wiki', { wikiName: this.wikiName })
				},
				{
					type: 'side-nav-menu-item',
					link: 'recent-wiki-activity',
					name: i18n.t('main.title', {ns: 'recent-wiki-activity'}),
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav'
				}];
			}
			// TODO: add discussions
			return local.concat(nav.map(function(item) {
				index++;
				return {
					type: 'side-nav-menu-item',
					//TODO: fix href
					href: item.href,
					link: 'wiki-page',
					name: item.text,
					children: Boolean(item.children),
					index: index,
					trackLabel: `local-nav-open-link-index-${index}`
				};
			}));
			//TODO: add random page
		},

		actions: {
			linkClick(item) {
				track({
					action: trackActions.click,
					category: item.trackCategory ? item.trackCategory : 'side-nav',
					label: item.trackLabel
				});
			},

			goBack() {
				this.get('state').popObject();
			},

			goToSubNav(index) {
				this.get('state').pushObject(index);
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
