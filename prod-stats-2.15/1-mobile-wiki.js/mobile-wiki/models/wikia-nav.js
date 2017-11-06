define('mobile-wiki/models/wikia-nav', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	var A = Ember.A,
	    EmberObject = Ember.Object,
	    computed = Ember.computed,
	    get = Ember.get,
	    inject = Ember.inject;
	exports.default = EmberObject.extend({
		i18n: inject.service(),
		logger: inject.service(),
		wikiVariables: inject.service(),
		dsGlobalNavigation: {},
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
		localLinks: computed.reads('wikiVariables.localNav'),
		discussionsEnabled: computed.reads('wikiVariables.enableDiscussions'),
		wikiName: computed.reads('wikiVariables.siteName'),
		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),

		/**
   * Iteratively traverse local navigation tree to find out root node
   * of current nav state
   * @returns {Object} currentLocalNav
   */
		currentLocalNav: computed('state.[]', 'localLinks', function () {
			var state = this.get('state');
			var localNav = this.get('localLinks'),
			    parent = void 0,
			    node = void 0;

			if (!this.get('inExploreNav')) {
				for (var i = 0; i < state.length; i++) {
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

		currentLocalLinks: computed.or('currentLocalNav.children', 'localLinks'),

		header: computed.or('currentLocalNav.text', 'exploreWikisLabel'),

		inExploreNav: computed('state.[]', function () {
			var state = this.get('state');

			return state.length && state[0] === 0;
		}),

		inSubNav: computed.bool('currentLocalNav.children.length'),

		inRoot: computed('inSubNav', 'inExploreNav', function () {
			return !this.get('inSubNav') && !this.get('inExploreNav');
		}),

		// keep it sync with navigation order
		items: computed('exploreItems', 'globalItems', 'exploreSubMenuItem', 'localNavHeaderItem', 'discussionItem', 'localItems', 'randomPageItem', function () {
			return [].concat(_toConsumableArray(this.get('exploreItems')), _toConsumableArray(this.get('globalItems')), _toConsumableArray(this.get('exploreSubMenuItem')), _toConsumableArray(this.get('localNavHeaderItem')), _toConsumableArray(this.get('discussionItem')), _toConsumableArray(this.get('localItems')), _toConsumableArray(this.get('randomPageItem')));
		}),

		exploreItems: computed('inExploreNav', 'exploreWikis', function () {
			var _this = this;

			var wikis = this.get('exploreWikis');

			return this.get('inExploreNav') && get(wikis, 'links.length') && get(wikis, 'links').map(function (item) {
				return {
					type: 'nav-menu-external',
					href: item.href,
					name: _this.get('i18n').t(item.title.key, {
						ns: 'design-system'
					}),
					trackLabel: 'open-' + item.title.key
				};
			}) || [];
		}),

		globalItems: computed('inRoot', 'hubsLinks', function () {
			var _this2 = this;

			return this.get('inRoot') && this.get('hubsLinks.length') && this.get('hubsLinks').map(function (item) {
				return {
					type: 'nav-menu-external',
					className: 'nav-menu--external nav-menu--' + item.brand,
					href: item.href,
					name: _this2.get('i18n').t(item.title.key, {
						ns: 'design-system'
					}),
					trackLabel: 'open-hub-' + item.title.key
				};
			}) || [];
		}),

		exploreSubMenuItem: computed('inRoot', 'exploreWikis', function () {
			var wikis = this.get('exploreWikis');

			if (this.get('inRoot') && get(wikis, 'links.length')) {
				if (wikis.header) {
					return [{
						type: 'nav-menu-root',
						className: 'nav-menu--explore',
						index: 0,
						name: this.get('exploreWikisLabel'),
						trackLabel: 'open-' + wikis.header.title.key
					}];
				} else {
					var firstLink = wikis.links[0],
					    messageKey = firstLink.title.key;

					return [{
						type: 'nav-menu-external',
						className: 'nav-menu--external',
						href: firstLink.href,
						name: this.get('i18n').t(messageKey, {
							ns: 'design-system'
						}),
						trackLabel: 'open-' + messageKey
					}];
				}
			}

			return [];
		}),

		localNavHeaderItem: computed('inRoot', 'wikiName', function () {
			return this.get('inRoot') && this.get('wikiName') && [{
				type: 'nav-menu-header',
				route: 'wiki-page',
				href: this.get('mainPageTitle'),
				name: this.get('i18n').t('navigation.explore-wiki', { wikiName: this.get('wikiName') })
			}] || [];
		}),

		discussionItem: computed('inRoot', 'discussionsEnabled', function () {
			return this.get('inRoot') && this.get('discussionsEnabled') && [{
				type: 'nav-menu-external',
				href: '/d/f',
				name: this.get('i18n').t('app.discussions-label'),
				trackCategory: 'discussion',
				trackLabel: 'local-nav'
			}] || [];
		}),

		localItems: computed('inExploreNav', 'currentLocalLinks', function () {
			return !this.get('inExploreNav') && this.get('currentLocalLinks').map(function (item, index) {
				return {
					type: item.children ? 'nav-menu-root' : 'nav-menu-item',
					href: item.href.replace(/^(\/wiki)?\//i, ''),
					route: 'wiki-page',
					name: item.text,
					index: index + 1,
					trackLabel: 'local-nav-open-link-index-' + (index + 1)
				};
			}) || [];
		}),

		randomPageItem: computed('inRoot', function () {
			return this.get('inRoot') && [{
				type: 'nav-menu-item',
				name: this.get('i18n').t('navigation.random-page-label'),
				trackLabel: 'random-page',
				actionId: 'onRandomPageClick'
			}] || [];
		}),

		init: function init() {
			this._super.apply(this, arguments);
			// holds a list of indexes defining a path to current branch in a navigation tree
			this.state = A([]);
		},
		goRoot: function goRoot() {
			this.set('state', A([]));
		},
		goBack: function goBack() {
			this.get('state').popObject();
		},


		/**
   * adds clicked index to current state, which causes rerender of menu
   *
   * @param {number} index
   * @returns {void}
   */
		goToSubNav: function goToSubNav(index) {
			this.get('state').pushObject(index);
		}
	});
});