import Ember from 'ember';
import AdsMixin from '../mixins/ads';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['category-collections'],
		batchIsLoading: false,

		didReceiveAttrs() {
			if (this.get('setupAds') === true) {
				this.setupAdsContext(this.get('adsContext'));
			}
		},

		actions: {
			loadBatch() {
				this.set('batchIsLoading', true);

				this.get('loadBatch')(...arguments).then(() => {
					this.set('batchIsLoading', false);

					window.document.getElementById(arguments[0]).scrollIntoView();
					window.scrollBy(0, -50);
				});
			}
		}
	}
);
