import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import TrackClickMixin from '../mixins/track-click';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	TrackClickMixin,
	{
		classNames: ['category-section'],
		classNameBindings: ['loadingBatch'],
		loadingBatch: false,

		actions: {
			loadBatch(index, batch, label) {
				this.trackClick('category-page', `load-${label}`);
				this.set('loadingBatch', true);

				this.get('loadBatch')(...arguments).then(() => {
					this.set('loadingBatch', false);

					window.document.getElementById(index).scrollIntoView();
					window.scrollBy(0, -50);
				});
			}
		}
	}
);
