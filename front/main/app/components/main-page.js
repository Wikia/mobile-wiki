import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import TrackClickMixin from '../mixins/track-click';
import {setTrackContext, updateTrackedUrl, trackPageView} from 'common/utils/track';

export default Ember.Component.extend(
	AdsMixin,
	TrackClickMixin,
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
		didReceiveAttrs() {
			Ember.run.schedule('afterRender', this, () => {
				setTrackContext({
					a: this.get('title'),
					n: this.get('ns'),
				});

				updateTrackedUrl(window.location.href);
				trackPageView(this.get('adsContext.targeting'));

				this.injectMainPageAds();
				this.setupAdsContext(this.get('adsContext'));
			});
		},
	}
);
