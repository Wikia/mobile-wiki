define('mobile-wiki/components/article-wrapper', ['exports', 'mobile-wiki/mixins/languages', 'mobile-wiki/mixins/portable-infobox-hero-image', 'mobile-wiki/mixins/viewport', 'mobile-wiki/utils/track', 'mobile-wiki/utils/mediawiki-namespace'], function (exports, _languages, _portableInfoboxHeroImage, _viewport, _track, _mediawikiNamespace) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var not = Ember.computed.not;
	var oneWay = Ember.computed.oneWay;
	var bool = Ember.computed.bool;
	var equal = Ember.computed.equal;
	var gte = Ember.computed.gte;
	var scheduleOnce = Ember.run.scheduleOnce;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend(_portableInfoboxHeroImage.default, _languages.default, _viewport.default, {
		classNames: ['article-wrapper'],
		currentUser: service(),
		wikiVariables: service(),
		displayEmptyArticleInfo: true,
		hammerOptions: {
			touchAction: 'auto',
			cssProps: {
				/**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
     * 'default' displays the callout
     * 'none' disables the callout
     * hammer.js sets it to 'none' by default so we have to override
     */
				touchCallout: 'default'
			}
		},

		/**
   * Checks if contribution component should be enabled
   *
   * @returns {boolean} True if contribution component is enabled for this community
   */
		contributionEnabledForCommunity: not('wikiVariables.disableMobileSectionEditor'),

		/**
   * Checks if mobile contribution features are enabled.
   * Contribution features include section editor and photo upload.
   *
   * @returns {boolean} True if the contribution features should be rendered on the page
   */
		contributionEnabled: computed('model.isMainPage', function () {
			return !this.get('model.isMainPage') && this.get('contributionEnabledForCommunity') &&
			// @todo XW-1196: Enable article editing on blog, category and file pages
			this.getWithDefault('model.ns', 0) !== _mediawikiNamespace.namespace.BLOG_ARTICLE && this.getWithDefault('model.ns', 0) !== _mediawikiNamespace.namespace.CATEGORY && this.getWithDefault('model.ns', 0) !== _mediawikiNamespace.namespace.FILE;
		}),

		/**
   * Determine if the edit section icon should be rendered
   *
   * @returns {boolean} True if the edit icon should be rendered
   */
		editIconVisible: oneWay('contributionEnabled'),

		/**
   * For section editor, checks if the user is allowed to edit
   * - Logged in users are always allowed to edit
   * - Wikias with disableAnonymousEditing set need login to edit
   * - Coppa wikias (for wikias directed at children) always require login to edit
   *
   * @returns {boolean} True if edit is allowed
   */
		editAllowed: computed(function () {
			var isCoppaWiki = this.get('wikiVariables.isCoppaWiki') || false,
			    disableAnonymousEditing = this.get('wikiVariables.disableAnonymousEditing') || false,
			    isLoggedIn = this.get('currentUser.isAuthenticated');

			if (isLoggedIn) {
				return true;
			} else {
				return !(isCoppaWiki || disableAnonymousEditing);
			}
		}),

		hasFeaturedVideo: bool('model.featuredVideo'),

		isJWPlayer: equal('model.featuredVideo.provider', 'jwplayer'),

		showComments: gte('model.comments', 0),

		actions: {
			/**
    * @param {string} title
    * @param {number} sectionIndex
    * @returns {void}
    */
			edit: function edit(title, sectionIndex) {
				this.sendAction('edit', title, sectionIndex);
			},


			/**
    * @param {string} lightboxType
    * @param {*} lightboxData
    * @returns {void}
    */
			openLightbox: function openLightbox(lightboxType, lightboxData) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'media',
					label: 'open'
				});

				this.sendAction('openLightbox', lightboxType, lightboxData);
			},
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			},
			toggleSiteHeadShadow: function toggleSiteHeadShadow(visible) {
				this.sendAction('toggleSiteHeadShadow', visible);
			}
		},

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var _this = this;

			scheduleOnce('afterRender', this, function () {
				_this.sendAction('articleRendered');
			});
		}
	});
});