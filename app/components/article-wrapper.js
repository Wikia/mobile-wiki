import {inject as service} from '@ember/service';
import {not, oneWay, bool, equal, gte} from '@ember/object/computed';
import {scheduleOnce} from '@ember/runloop';
import Component from '@ember/component';
import {computed} from '@ember/object';
import LanguagesMixin from '../mixins/languages';
import PortableInfoboxHeroImageMixin from '../mixins/portable-infobox-hero-image';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from '../utils/track';
import {namespace as mediawikiNamespace} from '../utils/mediawiki-namespace';

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
		currentUser: service(),
		wikiVariables: service(),

		classNames: ['article-wrapper'],
		displayEmptyArticleInfo: true,

		/**
		 * Checks if contribution component should be enabled
		 *
		 * @returns {boolean} True if contribution component is enabled for this community
		 */
		contributionEnabledForCommunity: not('wikiVariables.disableMobileSectionEditor'),

		showComments: gte('model.comments', 0),

		/**
		 * Determine if the edit section icon should be rendered
		 *
		 * @returns {boolean} True if the edit icon should be rendered
		 */
		editIconVisible: oneWay('contributionEnabled'),

		hasFeaturedVideo: bool('model.featuredVideo'),

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

		init() {
			this._super(...arguments);

			this.hammerOptions = {
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
			};
		},

		actions: {
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

				this.get('openLightbox')(lightboxType, lightboxData);
			},

			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			},

			forceFeaturedVideoVisibility() {
				this.set('hasFeaturedVideo', true);
			}
		},
	}
);
