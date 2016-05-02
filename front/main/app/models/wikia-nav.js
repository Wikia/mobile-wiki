import Ember from 'ember';

export default Ember.Object.extend({

	init() {
		this._super(...arguments);
		this.state = [];
	},

	hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
	localLinks: Ember.get(Mercury, 'wiki.navigation2016.localNav'),
	exploreWikiaLinks: Ember.get(Mercury, 'wiki.navigation2016.exploreWikiaMenu'),
	exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
	wikiName: Ember.get(Mercury, 'wiki.siteName'),
	wikiLang: Ember.get(Mercury, 'wiki.language.content'),

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

		for (const i of this.get('state')) {
			if (nav[i - 1]) {
				header = nav[i - 1].text;
			}
			nav = nav[i - 1] ? nav[i - 1].children : nav;
		}
		return header;
	}),

	inSubNav: Ember.computed('state.[]', function () {
		return Boolean(this.get('state').length);
	}),

	goRoot() {
		this.set('state.[]', []);
	},

	goBack() {
		this.get('state').popObject();
	},

	goToSubNav(index) {
		this.get('state').pushObject(index);
	},

	prepareExplorationItems() {
		return this.get('exploreWikiaLinks').map((item) => {
			return {
				type: 'side-nav-menu-external',
				href: item.href,
				name: item.textEscaped,
				trackLabel: `open-${item.trackingLabel}`
			};
		});
	},

	prepareGlobalItems() {
		let global = [];

		if (this.get('wikiLang') === 'en') {
			global = this.get('hubsLinks').map((item) => {
				return {
					type: 'side-nav-menu-external',
					className: item.specialAttr,
					href: item.href,
					name: item.textEscaped,
					trackLabel: `open-hub-${item.specialAttr}`
				};
			});
		}
		return global.concat([{
			// add exploration sub menu item
			type: 'side-nav-menu-root',
			index: 0,
			name: this.get('exploreWikiaLabel'),
			trackLabel: 'open-explore-wikia'
		}]);
	},

	prepareLocalItems(state) {
		let nav = this.get('localLinks'),
			index = 0,
			local;

		if (state.length > 0) {
			// look for correct subnav
			for (const i of state) {
				nav = nav[i - 1] ? nav[i - 1].children : nav;
			}
		}
		local = nav.map((item) => {
			index++;
			return {
				type: Boolean(item.children) ? 'side-nav-menu-root' : 'side-nav-menu-item',
				href: item.href.replace('/wiki/', ''),
				link: 'wiki-page',
				name: item.text,
				index,
				trackLabel: `local-nav-open-link-index-${index}`
			};
		});

		if (state.length === 0) {
			local = [
				{
					type: 'side-nav-menu-header',
					name: i18n.t('app.explore-wiki', {wikiName: this.wikiName})
				},
				{
					type: 'side-nav-menu-item',
					link: 'recent-wiki-activity',
					newBadge: true,
					name: i18n.t('main.title', {ns: 'recent-wiki-activity'}),
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav'
				}]
				.concat(local)
				.concat([{
					type: 'side-nav-menu-item',
					href: '#',
					name: i18n.t('app.random-page-label'),
					trackLabel: 'random-page',
					clickHandler: 'loadRandomArticle'
				}]);
		}
		return local;
	}

});
