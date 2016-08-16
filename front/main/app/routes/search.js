import Ember from 'ember';
import {track, trackActions, trackPageView} from 'common/utils/track';
import SearchModel from '../models/search';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';

const {Route} = Ember;

export default Route.extend(
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['search-result-page', 'show-global-footer'],
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
	}
);
