import Ember from 'ember';
import {track, trackActions, trackPageView} from '../utils/track';
import SearchModel from '../models/search';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';
import ScriptsForFastBootOnlyMixin from '../mixins/scripts-fastboot-only';

const {Route, inject} = Ember;

export default Route.extend(
	RouteWithBodyClassNameMixin,
	ScriptsForFastBootOnlyMixin,
	{
		wikiVariables: inject.service(),
		bodyClassNames: ['search-result-page', 'show-global-footer'],
		queryParams: {
			query: {
				refreshModel: true
			}
		},

		model(params) {
			const model = SearchModel.create({
				host: this.get('wikiVariables.host')
			});

			if (params.query) {
				model.search(params.query);
			}

			return model;
		},

		afterModel(model, transition) {
			this._super(...arguments);

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
