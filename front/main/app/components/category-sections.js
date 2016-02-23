import Ember from 'ember';
import AdsMixin from '../mixins/ads';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['category-sections'],

		didReceiveAttrs() {
			if (this.get('setupAds') === true) {
				this.setupAdsContext(this.get('adsContext'));
			}
		},

		actions: {
			loadBatch(index, batch) {
				this.set(`navigationClassNameFor${index}`, ' is-loading');

				this.get('loadBatch')(...arguments).then(() => {
					this.set(`navigationClassNameFor${index}`, '');

					window.document.getElementById(arguments[0]).scrollIntoView();
					window.scrollBy(0, -50);
				});
			}
		}
	}
);
