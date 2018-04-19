import {inject as service} from '@ember/service';
import {reads, or, bool} from '@ember/object/computed';
import {A} from '@ember/array';
import EmberObject, {get, computed} from '@ember/object';

export default EmberObject.extend({
	i18n: service(),
	logger: service(),
	wikiUrls: service(),
	wikiVariables: service(),

	dsGlobalNavigation: null,

	hubsLinks: computed(function () {
		return this.get('dsGlobalNavigation.fandom_overview.links');
	}),
	exploreWikis: computed(function () {
		return this.get('dsGlobalNavigation.wikis');
	}),
	exploreWikisLabel: computed(function () {
		return this.get('i18n').t(this.get('dsGlobalNavigation.wikis.header.title.key'), {
			ns: 'design-system'
		});
	}),
	localLinks: reads('wikiVariables.localNav'),
	discussionsEnabled: reads('wikiVariables.enableDiscussions'),
	wikiName: reads('wikiVariables.siteName'),
	mainPageTitle: reads('wikiVariables.mainPageTitle'),

	/**
	 * Iteratively traverse local navigation tree to find out root node
	 * of current nav state
	 * @returns {Object} currentLocalNav
	 */
	currentLocalNav: computed('state.[]', 'localLinks', function () {
		const state = this.get('state');
		let localNav = this.get('localLinks'),
			parent, node;

		if (!this.get('inExploreNav')) {
			for (let i = 0; i < state.length; i++) {
				// local nav indexes are shifted by 1,
				// 0 is reserved for exploration nav
				node = localNav[state[i] - 1];
				// check if nav branch
				if (node && node.children) {
					parent = node;
					localNav = node.children;
				} else {
					this.get('logger').error('Incorrect navigation state');
					return {};
				}
			}
		}

		return parent || {};
	}),

	currentLocalLinks: or('currentLocalNav.children', 'localLinks'),

	header: or('currentLocalNav.text', 'exploreWikisLabel'),

	inExploreNav: computed('state.[]', function () {
		const state = this.get('state');

		return state.length && state[0] === 0;
	}),

	inSubNav: bool('currentLocalNav.children.length'),

	inRoot: computed('inSubNav', 'inExploreNav', function () {
		return !this.get('inSubNav') && !this.get('inExploreNav');
	}),

	// keep it sync with navigation order
	items: computed('exploreItems', 'globalItems', 'exploreSubMenuItem', 'localNavHeaderItem',
		'discussionItem', 'localItems', 'randomPageItem', function () {
			return [].concat(
				this.get('exploreItems'),
				this.get('globalItems'),
				this.get('exploreSubMenuItem'),
				this.get('localNavHeaderItem'),
				this.get('discussionItem'),
				this.get('localItems'),
				this.get('randomPageItem')
			);
		}),

	exploreItems: computed('inExploreNav', 'exploreWikis', function () {
		const wikis = this.get('exploreWikis');

		return this.get('inExploreNav') &&
			get(wikis, 'links.length') &&
			get(wikis, 'links').map((item) => {
				return {
					type: 'nav-menu-external',
					href: item.href,
					name: this.get('i18n').t(item.title.key, {
						ns: 'design-system'
					}),
					trackLabel: `open-${item.title.key}`
				};
			}) || [];
	}),

	globalItems: computed('inRoot', 'hubsLinks', function () {
		return this.get('inRoot') &&
			this.get('hubsLinks.length') &&
			this.get('hubsLinks').map((item) => {
				return {
					type: 'nav-menu-external',
					className: `nav-menu--external nav-menu--${item.brand}`,
					href: item.href,
					name: this.get('i18n').t(item.title.key, {
						ns: 'design-system'
					}),
					trackLabel: `open-hub-${item.title.key}`
				};
			}) || [];
	}),

	exploreSubMenuItem: computed('inRoot', 'exploreWikis', function () {
		const wikis = this.get('exploreWikis');

		if (this.get('inRoot') && get(wikis, 'links.length')) {
			if (wikis.header) {
				return [{
					type: 'nav-menu-root',
					className: 'nav-menu--explore',
					index: 0,
					name: this.get('exploreWikisLabel'),
					trackLabel: `open-${wikis.header.title.key}`
				}];
			} else {
				const firstLink = wikis.links[0],
					messageKey = firstLink.title.key;

				return [{
					type: 'nav-menu-external',
					className: 'nav-menu--external',
					href: firstLink.href,
					name: this.get('i18n').t(messageKey, {
						ns: 'design-system'
					}),
					trackLabel: `open-${messageKey}`
				}];
			}
		}

		return [];
	}),

	localNavHeaderItem: computed('inRoot', 'wikiName', function () {
		return this.get('inRoot') &&
			this.get('wikiName') &&
			[{
				type: 'nav-menu-header',
				route: 'wiki-page',
				href: this.get('mainPageTitle'),
				name: this.get('i18n').t('navigation.explore-wiki', {wikiName: this.get('wikiName')})
			}] || [];
	}),

	discussionItem: computed('inRoot', 'discussionsEnabled', function () {
		return this.get('inRoot') &&
			this.get('discussionsEnabled') &&
			[{
				type: 'nav-menu-external',
				href: `${this.get('wikiUrls.langPath')}/d/f`,
				name: this.get('i18n').t('app.discussions-label'),
				trackCategory: 'discussion',
				trackLabel: 'local-nav'
			}] || [];
	}),

	localItems: computed('inExploreNav', 'currentLocalLinks', function () {
		return !this.get('inExploreNav') &&
			this.get('currentLocalLinks').map((item, index) => {
				return {
					type: item.children ? 'nav-menu-root' : 'nav-menu-item',
					href: item.href.replace(new RegExp(`^(${this.get('wikiUrls.langPathRegexp')}?/wiki)?/`, 'i'), ''),
					route: 'wiki-page',
					name: item.text,
					index: index + 1,
					trackLabel: `local-nav-open-link-index-${index + 1}`
				};
			}) || [];
	}),

	randomPageItem: computed('inRoot', function () {
		return this.get('inRoot') &&
			[{
				type: 'nav-menu-item',
				name: this.get('i18n').t('navigation.random-page-label'),
				trackLabel: 'random-page',
				actionId: 'onRandomPageClick'
			}] || [];
	}),

	init() {
		this._super(...arguments);
		// holds a list of indexes defining a path to current branch in a navigation tree
		this.state = A([]);
	},

	goRoot() {
		this.set('state', A([]));
	},

	goBack() {
		this.get('state').popObject();
	},

	/**
	 * adds clicked index to current state, which causes rerender of menu
	 *
	 * @param {number} index
	 * @returns {void}
	 */
	goToSubNav(index) {
		this.get('state').pushObject(index);
	}
});
