import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import TrackClickMixin from '../mixins/track-click';
import {setTrackContext, updateTrackedUrl, trackPageView} from 'common/utils/track';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';

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

				this.get('currentUser.powerUserTypes').then((powerUserTypes) => {
					if (powerUserTypes.poweruser_frequent) {
						UniversalAnalytics.setDimension(24, 'yes');
					} else {
						UniversalAnalytics.setDimension(24, 'no');
					}

					if (powerUserTypes.poweruser_lifetime) {
						UniversalAnalytics.setDimension(23, 'yes');
					} else {
						UniversalAnalytics.setDimension(23, 'no');
					}

					trackPageView(this.get('adsContext.targeting'));
				}).catch(() => {
					if (this.get('currentUser.userId') !== null) {
						UniversalAnalytics.setDimension(23, 'no');
						UniversalAnalytics.setDimension(24, 'no');
					}

					trackPageView(this.get('adsContext.targeting'));
				});

				this.injectMainPageAds();
				this.setupAdsContext(this.get('adsContext'));
			});
		},
	}
);
