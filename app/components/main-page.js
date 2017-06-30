import Ember from 'ember';
import AdsMixin from '../mixins/ads';

const {Component, computed, inject, run} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['main-page-modules', 'main-page-body'],
		tagName: 'section',

		currentUser: inject.service(),
		wikiVariables: inject.service(),

		title: computed.reads('wikiVariables.siteName'),

		curatedContentToolButtonVisible: computed.and('currentUser.rights.curatedcontent'),

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
		didInsertElement() {
			this._super(...arguments);

			run.scheduleOnce('afterRender', this, () => {
				this.setupAdsContext(this.get('adsContext'));
				this.get('ads.module').onReady(() => {
					this.injectMainPageAds();
				});
			});
		},
	}
);
