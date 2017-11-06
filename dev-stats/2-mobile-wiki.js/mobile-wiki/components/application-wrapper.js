define('mobile-wiki/components/application-wrapper', ['exports', 'mobile-wiki/utils/article-link', 'mobile-wiki/utils/track-perf', 'mobile-wiki/utils/browser'], function (exports, _articleLink, _trackPerf, _browser) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    $ = Ember.$;
	exports.default = Component.extend({
		attributeBindings: ['dir'],
		classNames: ['application-wrapper'],
		classNameBindings: ['smartBannerVisible', 'verticalClass', 'isFandomAppSmartBannerVisible:with-fandom-app-smart-banner', 'bfaaTemplate'],
		scrollLocation: null,
		smartBannerVisible: false,
		firstRender: true,

		ads: inject.service(),
		currentUser: inject.service(),
		fastboot: inject.service(),
		logger: inject.service(),
		wikiVariables: inject.service(),

		dir: computed.reads('wikiVariables.language.contentDir'),

		bfaaTemplate: computed.bool('ads.siteHeadOffset'),

		drawerContentComponent: computed('activeDrawerContent', function () {
			return 'wikia-' + this.get('activeDrawerContent');
		}),

		verticalClass: computed('wikiVariables', function () {
			var vertical = this.get('wikiVariables.vertical');

			return vertical + '-vertical';
		}),

		/**
   * @returns {boolean}
   */
		isUserLangEn: computed.equal('currentUser.language', 'en'),
		shouldShowFandomAppSmartBanner: computed.and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
		isFandomAppSmartBannerVisible: computed.and('shouldShowFandomAppSmartBanner', 'smartBannerVisible'),

		/**
   * @returns {void}
   */
		willInsertElement: function willInsertElement() {
			$('#preload').remove();
		},


		/**
   * @returns {void}
   */
		didRender: function didRender() {
			if (this.firstRender === true) {
				this.firstRender = false;

				if (!this.get('fastboot.isFastBoot')) {
					(0, _trackPerf.trackPerf)({
						name: 'appRendered',
						type: 'mark',
						context: {
							logged_in: this.get('currentUser.isAuthenticated')
						}
					});
				}
			}
		},


		actions: {
			/**
    * @param {string} content
    * @returns {void}
    */
			setDrawerContent: function setDrawerContent(content) {
				this.set('activeDrawerContent', content);
			},
			closeDrawer: function closeDrawer() {
				this.set('activeDrawerContent', null);
				this.get('toggleDrawer')(false);
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
		click: function click(event) {
			/**
    * check if the target has a parent that is an anchor
    * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
    * because if the user clicks the part of the link in the <i></i> then
    * target.tagName will register as 'I' and not 'A'.
    */
			var $anchor = $(event.target).closest('a'),
			    target = $anchor.length ? $anchor[0] : event.target;
			var tagName = void 0;

			if (target && this.shouldHandleClick(target)) {
				tagName = target.tagName.toLowerCase();

				if (tagName === 'a' && !(0, _articleLink.isHashLink)(target)) {
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
		shouldHandleClick: function shouldHandleClick(target) {
			var $target = $(target),
			    isReference = this.targetIsReference(target);

			return $target.closest('.mw-content').length &&
			// ignore polldaddy content
			!$target.closest('.PDS_Poll').length &&
			// don't need special logic for article references
			!isReference;
		},


		/**
   * Determine if the clicked target is an reference/in references list (in text or at the bottom
   * of article)
   *
   * @param {EventTarget} target
   * @returns {boolean}
   */
		targetIsReference: function targetIsReference(target) {
			var $target = $(target);

			return Boolean($target.closest('.references').length || $target.parent('.reference').length);
		},


		/**
   * @param {HTMLAnchorElement|EventTarget} target
   * @returns {void}
   */
		handleLink: function handleLink(target) {
			this.get('logger').debug('Handling link with href:', target.href);

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
				if (!target.href.match('^' + window.location.origin + '/a/.*/comments$')) {
					this.sendAction('closeLightbox');
					this.sendAction('handleLink', target);
				}
			}
		}
	});
});