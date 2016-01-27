import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import TrackClickMixin from '../mixins/track-click';
import {setTrackContext, updateTrackedUrl, trackPageView} from 'common/utils/track';
import {setDimension} from 'common/modules/Trackers/UniversalAnalytics';

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
				const articleType = this.get('articleType');

				setTrackContext({
					a: this.get('title'),
					n: this.get('ns')
				});

				if (articleType) {
					setDimension(19, articleType);
				}

				updateTrackedUrl(window.location.href);
				trackPageView(this.get('adsContext.targeting'));

				this.injectMainPageAds();
				this.setupAdsContext(this.get('adsContext'));
			});
		},
	}
);
