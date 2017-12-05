import {inject as service} from '@ember/service';
import {reads, and} from '@ember/object/computed';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import AdsMixin from '../mixins/ads';

export default Component.extend(
	AdsMixin,
	{
		classNames: ['main-page-modules', 'main-page-body'],
		tagName: 'section',

		currentUser: service(),
		wikiVariables: service(),

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
