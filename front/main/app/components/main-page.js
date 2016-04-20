import Ember from 'ember';
import AdsMixin from '../mixins/ads';

export default Ember.Component.extend(
	AdsMixin,
	{
		classNames: ['main-page-modules', 'main-page-body'],
		tagName: 'section',

		currentUser: Ember.inject.service(),

		curatedContentToolButtonVisible: Ember.computed.and('currentUser.rights.curatedcontent'),

		actions: {
			/**
			 * @param {string} lightboxType
			 * @param {Object} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxData) {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			/**
			 * @param {CuratedContentItem} item
			 * @returns {void}
			 */
			openCuratedContentItem(item) {
				this.sendAction('openCuratedContentItem', item);
			},
		},

		/**
		 * @returns {void}
		 */
		didRender() {
			this._super(...arguments);
			this.injectMainPageAds();
			this.setupAdsContext(this.get('adsContext'));
		},
	}
);
