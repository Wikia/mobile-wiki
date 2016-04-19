import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import {track, trackActions} from 'common/utils/track';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['category-section'],
		classNameBindings: ['loadingBatch'],
		loadingBatch: false,

		actions: {
			loadBatch(index, batch, label) {
				track({
					action: trackActions.click,
					category: 'category-page',
					label: `load-${label}`
				});

				this.set('loadingBatch', true);

				this.get('loadBatch')(...arguments).then(() => {
					this.set('loadingBatch', false);

					window.document.getElementById(index).scrollIntoView();
					window.scrollBy(0, -50);
				});
			},

			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		}
	}
);
