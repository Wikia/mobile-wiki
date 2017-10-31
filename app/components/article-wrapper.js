import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import PortableInfoboxHeroImageMixin from '../mixins/portable-infobox-hero-image';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from '../utils/track';
import {namespace as mediawikiNamespace} from '../utils/mediawiki-namespace';

const {Component, computed, inject} = Ember;

/**
 * @typedef {Object} ArticleSectionHeader
 * @property {HTMLElement} element
 * @property {string} level
 * @property {string} name
 * @property {string} [id]
 * @property {string} section
 */

export default Component.extend(
	PortableInfoboxHeroImageMixin,
	LanguagesMixin,
	ViewportMixin,
	{
		classNames: ['article-wrapper'],
		currentUser: inject.service(),
		wikiVariables: inject.service(),
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
				touchCallout: 'default',
			}
		},

		/**
		 * Checks if contribution component should be enabled
		 *
		 * @returns {boolean} True if contribution component is enabled for this community
		 */
		contributionEnabledForCommunity: computed.not('wikiVariables.disableMobileSectionEditor'),

		/**
		 * Checks if mobile contribution features are enabled.
		 * Contribution features include section editor and photo upload.
		 *
		 * @returns {boolean} True if the contribution features should be rendered on the page
		 */
		contributionEnabled: computed('model.isMainPage', function () {
			return !this.get('model.isMainPage') &&
				this.get('contributionEnabledForCommunity') &&
				// @todo XW-1196: Enable article editing on blog, category and file pages
				this.getWithDefault('model.ns', 0) !== mediawikiNamespace.BLOG_ARTICLE &&
				this.getWithDefault('model.ns', 0) !== mediawikiNamespace.CATEGORY &&
				this.getWithDefault('model.ns', 0) !== mediawikiNamespace.FILE;
		}),

		/**
		 * Determine if the edit section icon should be rendered
		 *
		 * @returns {boolean} True if the edit icon should be rendered
		 */
		editIconVisible: computed.oneWay('contributionEnabled'),

		/**
		 * For section editor, checks if the user is allowed to edit
		 * - Logged in users are always allowed to edit
		 * - Wikias with disableAnonymousEditing set need login to edit
		 * - Coppa wikias (for wikias directed at children) always require login to edit
		 *
		 * @returns {boolean} True if edit is allowed
		 */
		editAllowed: computed(function () {
			const isCoppaWiki = this.get('wikiVariables.isCoppaWiki') || false,
				disableAnonymousEditing = this.get('wikiVariables.disableAnonymousEditing') || false,
				isLoggedIn = this.get('currentUser.isAuthenticated');

			if (isLoggedIn) {
				return true;
			} else {
				return !(isCoppaWiki || disableAnonymousEditing);
			}
		}),

		hasFeaturedVideo: computed.bool('model.featuredVideo'),

		isJWPlayer: computed.equal('model.featuredVideo.provider', 'jwplayer'),

		showComments: computed.gte('model.comments', 0),

		actions: {
			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @returns {void}
			 */
			edit(title, sectionIndex) {
				this.sendAction('edit', title, sectionIndex);
			},

			/**
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxData) {
				track({
					action: trackActions.click,
					category: 'media',
					label: 'open'
				});

				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			},

			toggleSiteHeadShadow(visible) {
				this.sendAction('toggleSiteHeadShadow', visible);
			}
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			Ember.run.scheduleOnce('afterRender', this, () => {
				this.sendAction('articleRendered');
			});
		},
	}
);
