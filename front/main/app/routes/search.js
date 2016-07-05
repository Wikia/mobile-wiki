import Ember from 'ember';
import {track, trackActions, trackPageView} from 'common/utils/track';
import SearchModel from '../models/search';

const {Route} = Ember;

export default Route.extend({
	queryParams: {
		query: {
			refreshModel: true
		}
	},

	model(params) {
		const model = new SearchModel();

		if (params.query) {
			model.search(params.query);
		}

		return model;
	},

	activate() {
		Ember.$('body').addClass('search-result-page');
	},

	deactivate() {
		Ember.$('body').removeClass('search-result-page');
	},

	afterModel(model, transition) {
		transition.then(() => {
			trackPageView();
		});
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
