import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import SearchModel from '../models/search';

export default Ember.Route.extend({

	model(params) {
		const model = new SearchModel();

		if (params.query) {
			model.search(params.query);
		}

		return model;
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		didTransition() {
			track({
				action: trackActions.impression,
				category: 'app',
				label: 'search'
			});

			return true;
		}
	}
});
