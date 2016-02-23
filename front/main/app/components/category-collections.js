import Ember from 'ember';
import AdsMixin from '../mixins/ads';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['category-collections'],

		didReceiveAttrs() {
			if (this.get('setupAds') === true) {
				this.setupAdsContext(this.get('adsContext'));
			}
		}
	}
);
