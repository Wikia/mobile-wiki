import {inject as service} from '@ember/service';
import {reads, and} from '@ember/object/computed';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import AdsMixin from '../mixins/ads';

export default Component.extend(
	AdsMixin,
	{
		currentUser: service(),
		wikiVariables: service(),

		classNames: ['main-page-modules', 'main-page-body'],
		tagName: 'section',

		title: reads('wikiVariables.siteName'),

		curatedContentToolButtonVisible: and('currentUser.rights.curatedcontent'),

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
