import Ember from 'ember';
import AdsMixin from '../mixins/ads';

const {Component} = Ember;

export default Component.extend(
	AdsMixin,
	{
		classNames: ['category-section'],
		classNameBindings: ['loadingBatch'],
		loadingBatch: false,

		actions: {
			loadBatch(index) {
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
