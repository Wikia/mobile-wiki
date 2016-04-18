import Ember from 'ember';
import {trackPerf} from 'common/utils/track-perf';
// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
import {trackExperiment, trackActions} from 'common/utils/track';
import {getGroup} from 'common/modules/abtest';

/**
 * HTMLMouseEvent
 * @typedef {Object} HTMLMouseEvent
 * @extends {MouseEvent}
 * @property {HTMLElement} target
 */

/**
 * DOMStringMap
 * @typedef {Object} DOMStringMap
 * @property {string} galleryRef
 * @property {string} ref
 * @property {string} trackingCategory
 */

/**
 * EventTarget
 * @typedef {Object} EventTarget
 * @property {string} tagName
 */

export default Ember.Component.extend({
	classNames: ['application-wrapper'],
	classNameBindings: ['smartBannerVisible', 'verticalClass'],

	verticalClass: Ember.computed(() => {
		const vertical = Ember.get(Mercury, 'wiki.vertical');

		return `${vertical}-vertical`;
	}),

	noScroll: false,
	scrollLocation: null,
	smartBannerVisible: false,
	firstRender: true,

	noScrollObserver: Ember.observer('noScroll', function () {
		const $body = Ember.$('body');
		let scrollLocation;

		if (this.get('noScroll')) {
			scrollLocation = $body.scrollTop();

			this.set('scrollLocation', scrollLocation);

			$body.css('top', -scrollLocation)
				.addClass('no-scroll');
		} else {
			$body.removeClass('no-scroll')
				.css('top', '');

			window.scrollTo(0, this.get('scrollLocation'));
			this.set('scrollLocation', null);
		}
	}),

	/**
	 * @returns {void}
	 */
	willInsertElement() {
		$('#preload').remove();
	},

	/**
	 * @returns {void}
	 */
	didRender() {
		if (this.firstRender === true) {
			this.firstRender = false;

			trackPerf({
				name: 'appRendered',
				type: 'mark'
			});
		}
	},

	/**
	 * Necessary because presently, we open external links in new pages, so if we didn't
	 * cancel the click event on the current page, then the mouseUp handler would open
	 * the external link in a new page _and_ the current page would be set to that external link.
	 *
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event) {
		/**
		 * check if the target has a parent that is an anchor
		 * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
		 * because if the user clicks the part of the link in the <i></i> then
		 * target.tagName will register as 'I' and not 'A'.
		 */
		const $anchor = Ember.$(event.target).closest('a'),
			target = $anchor.length ? $anchor[0] : event.target;
		let tagName;

		if (target && this.shouldHandleClick(target)) {
			tagName = target.tagName.toLowerCase();

			if (tagName === 'a') {
				this.handleLink(target);
				event.preventDefault();
			}
		}
	},

	/**
	 * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
	 *
	 * @param {EventTarget} target
	 * @returns {boolean}
	 */
	shouldHandleClick(target) {
		const $target = $(target),
			isReference = this.targetIsReference(target);

		return (
			$target.closest('.mw-content').length &&
				// ignore polldaddy content
			!$target.closest('.PDS_Poll').length &&
				// don't need special logic for article references
			!isReference
		);
	},

	/**
	 * Determine if the clicked target is an reference/in references list (in text or at the bottom of article)
	 *
	 * @param {EventTarget} target
	 * @returns {boolean}
	 */
	targetIsReference(target) {
		const $target = $(target);

		return Boolean(
			$target.closest('.references').length ||
			$target.parent('.reference').length
		);
	},

	/**
	 * @param {HTMLAnchorElement|EventTarget} target
	 * @returns {void}
	 */
	handleLink(target) {
		Ember.Logger.debug('Handling link with href:', target.href);

		/**
		 * If either the target or the target's parent is an anchor (and thus target == true),
		 * then also check if the anchor has an href. If it doesn't we assume there is some other
		 * handler for it that deals with it based on ID or something and we just skip it.
		 */
		if (target && target.href) {
			/**
			 * But if it does have an href, we check that it's not the link to expand the comments
			 * If it's _any_ other link than that comments link, we stop its action and
			 * pass it up to handleLink
			 */
			if (!target.href.match(`^${window.location.origin}/a/.*/comments$`)) {
				this.sendAction('closeLightbox');
				this.sendAction('handleLink', target);
			}
		}
	},

	// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
	// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
	shouldFocusSearchInput: false,
	navABTestExperimentName: 'FAN_KNOWLEDGE_MERCURY_GLOBAL_NAV',
	navABTestDefaultGroup: 'DEFAULT',
	navABTestControlGroup: 'CONTROL',
	navABTestFabIconSearchGroup: 'FAB_ICON_SEARCH',
	navABTestFabIconMenuGroup: 'FAB_ICON_MENU',
	navABTestBarMenuIconGroup: 'BAR_MENU_ICON',
	navABTestBarDropdownIconGroup: 'BAR_DROPDOWN_ICON',
	navABTestButtonBarGroup: 'BUTTON_BAR',
	navABTestButtonBarMenuGroup: 'BUTTON_BAR_MENU_ICON',

	navABTestCurrentGroup: Ember.computed('navABTestExperimentName', function () {
		return getGroup(this.get('navABTestExperimentName'));
	}),

	navABTestIsFabSearchIcon: Ember.computed('navABTestCurrentGroup', 'navABTestFabIconSearchGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestFabIconSearchGroup');
	}),

	navABTestIsFabMenuIcon: Ember.computed('navABTestCurrentGroup', 'navABTestFabIconMenuGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestFabIconMenuGroup');
	}),

	navABTestIsBarMenuIcon: Ember.computed('navABTestCurrentGroup', 'navABTestBarMenuIconGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestBarMenuIconGroup');
	}),

	navABTestIsBarDropdownIcon: Ember.computed('navABTestCurrentGroup', 'navABTestBarDropdownIconGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestBarDropdownIconGroup');
	}),

	navABTestIsButtonBar: Ember.computed('navABTestCurrentGroup', 'navABTestButtonBarGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestButtonBarGroup');
	}),

	navABTestIsButtonBarMenu: Ember.computed('navABTestCurrentGroup', 'navABTestButtonBarMenuGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestButtonBarMenuGroup');
	}),

	navABTestEnableShare: Ember.computed('navABTestIsBarMenuIcon', 'navABTestIsBarDropdownIcon', function () {
		return !this.get('navABTestIsBarMenuIcon') && !this.get('navABTestIsBarDropdownIcon');
	}),

	displayFabIcon: Ember.computed.or('navABTestIsFabSearchIcon', 'navABTestIsFabMenuIcon'),

	displayButtonBar: Ember.computed.or('navABTestIsButtonBar', 'navABTestIsButtonBarMenu'),

	navABTestChangeUI: Ember.computed(
		'navABTestCurrentGroup', 'navABTestDefaultGroup', 'navABTestControlGroup',
		function () {
			const currentGroup = this.get('navABTestCurrentGroup');

			return currentGroup &&
				currentGroup !== this.get('navABTestDefaultGroup') &&
				currentGroup !== this.get('navABTestControlGroup');
		}
	),

	navABTestIsControlGroup: Ember.computed('navABTestCurrentGroup', 'navABTestControlGroup', function () {
		return this.get('navABTestCurrentGroup') === this.get('navABTestControlGroup');
	}),

	fabIcon: Ember.computed('navABTestIsFabSearchIcon', function () {
		return this.get('navABTestIsFabSearchIcon') ? 'search-for-ab-test' : 'menu';
	}),

	// used to set initial  content to search when opening side-nav
	shouldOpenNavSearch: false,

	homePageTitle: Ember.computed(() => {
		return Ember.get(Mercury, 'wiki.mainPageTitle');
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		fabIconClick() {
			const actionHandler = this.get('navABTestIsFabSearchIcon') ? 'showSearch' : 'showNav';

			this.trackExperimentClicks('fab-icon');
			this[actionHandler]();
		},

		/**
		 * @returns {void}
		 */
		leftSiteHeadIconClick() {
			this.trackExperimentClicks('site-head-icon-menu');
			this.showNav();
		},

		/**
		 * @returns {void}
		 */
		rightSiteHeadIconClick() {
			this.trackExperimentClicks('site-head-icon-search');
			this.showSearch();
		},

		/**
		 * @param {String} actionHandler
		 * @returns {void}
		 */
		bottomBarIconClick(actionHandler) {
			this.trackExperimentClicks(`bottom-bar-${actionHandler}`);
			this[actionHandler]();
		},

		/**
		 * @param {String} type
		 * @returns {void}
		 */
		bottomBarLinkClick(type) {
			this.trackExperimentClicks(`bottom-bar-${type}`);
		}
	},

	/**
	 * @param {String} trackingLabel
	 * @returns {void}
	 */
	trackExperimentClicks(trackingLabel) {
		trackExperiment(this.get('navABTestExperimentName'), {
			action: trackActions.click,
			category: 'entrypoint',
			label: trackingLabel
		});
	},

	/**
	 * @returns {void}
	 */
	showNav() {
		this.setProperties({
			shouldFocusSearchInput: false,
			shouldOpenNavSearch: false
		});
		this.get('toggleSideNav')(true);
	},

	/**
	 * @returns {void}
	 */
	showSearch() {
		this.setProperties({
			shouldFocusSearchInput: true,
			shouldOpenNavSearch: true
		});
		this.get('toggleSideNav')(true);
	}
});
