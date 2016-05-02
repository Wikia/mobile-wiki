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

	parent: Ember.computed('state.[]', 'localLinks', function () {
		const s = this.get('state');
		let nav = this.get('localLinks'),
			parent, item;

		if (s.length && s[0] !== 0) {
			for (const i of s) {
				item = nav[i - 1];
				if (item && item.children) {
					parent = item;
					nav = item.children;
				} else {
					throw new Error('Incorrect navigation state');
				}
			}
		}
		return parent || {};
	}),

	current: Ember.computed.or('parent.children', 'localLinks'),

	header: Ember.computed.or('parent.text', 'exploreWikiaLabel'),

	inExploreNav: Ember.computed('state.[]', function () {
		const s = this.get('state');

		return s.length && s[0] === 0;
	}),

	inSubNav: Ember.computed('parent.children', function () {
		return Boolean(this.get('parent.children') && this.get('parent.children').length);
	}),

	inRoot: Ember.computed('inSubNav', 'inExploreNav', function () {
		return !this.get('inSubNav') && !this.get('inExploreNav');
	}),

	items: Ember.computed('exploreItems', 'globalItems', 'exploreSubMenuItem', 'localNavHeaderItem',
		'recentActivityItem', 'localItems', 'randomPageItem', function () {
			return this.get('exploreItems')
				.concat(this.get('globalItems'))
				.concat(this.get('exploreSubMenuItem'))
				.concat(this.get('localNavHeaderItem'))
				.concat(this.get('recentActivityItem'))
				.concat(this.get('localItems'))
				.concat(this.get('randomPageItem'));
		}),

	exploreItems: Ember.computed('inExploreNav', 'exploreWikiaLinks', function () {
		return this.get('inExploreNav') &&
			this.get('exploreWikiaLinks').map((item) => {
				return {
					type: 'side-nav-menu-external',
					href: item.href,
					name: item.textEscaped,
					trackLabel: `open-${item.trackingLabel}`
				};
			}) || [];
	}),

	globalItems: Ember.computed('inRoot', 'wikiLang', 'hubsLinks', function () {
		return this.get('inRoot') &&
			this.get('wikiLang') === 'en' &&
			this.get('hubsLinks').map((item) => {
				return {
					type: 'side-nav-menu-external',
					className: item.specialAttr,
					href: item.href,
					name: item.textEscaped,
					trackLabel: `open-hub-${item.specialAttr}`
				};
			}) || [];
	}),

	exploreSubMenuItem: Ember.computed('inRoot', 'exploreWikiaLinks', function () {
		return this.get('inRoot') &&
			this.get('exploreWikiaLinks').length &&
			[{
				type: 'side-nav-menu-root',
				index: 0,
				name: this.get('exploreWikiaLabel'),
				trackLabel: 'open-explore-wikia'
			}] || [];
	}),

	localNavHeaderItem: Ember.computed('inRoot', 'wikiName', function () {
		return this.get('inRoot') &&
			this.get('wikiName') &&
			[{
				type: 'side-nav-menu-header',
				name: i18n.t('app.explore-wiki', {wikiName: this.get('wikiName')})
			}] || [];
	}),

	recentActivityItem: Ember.computed('inRoot', function () {
		return this.get('inRoot') &&
			[{
				type: 'side-nav-menu-item',
				link: 'recent-wiki-activity',
				name: i18n.t('main.title', {ns: 'recent-wiki-activity'}),
				trackCategory: 'recent-wiki-activity',
				trackLabel: 'local-nav'
			}] || [];
	}),

	localItems: Ember.computed('inExploreNav', 'current', function () {
		let index = 0;

		return !this.get('inExploreNav') &&
			this.get('current').map((item) => {
				index++;
				return {
					type: Boolean(item.children) ? 'side-nav-menu-root' : 'side-nav-menu-item',
					href: item.href.replace(/^(\/wiki)?\//i, ''),
					link: 'wiki-page',
					name: item.text,
					index,
					trackLabel: `local-nav-open-link-index-${index}`
				};
			}) || [];
	}),

	randomPageItem: Ember.computed('inRoot', function () {
		return this.get('inRoot') &&
			[{
				type: 'side-nav-menu-item',
				href: '#',
				name: i18n.t('app.random-page-label'),
				trackLabel: 'random-page',
				clickHandler: 'loadRandomArticle'
			}] || [];
	}),

	goRoot() {
		this.set('state.[]', []);
	},

	goBack() {
		this.get('state').popObject();
	},

	goToSubNav(index) {
		this.get('state').pushObject(index);
	}
});
