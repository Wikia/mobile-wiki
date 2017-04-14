import Ember from 'ember';
import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import SearchModel from '../models/search';
import {track, trackActions, trackPageView} from '../utils/track';

const {Route, inject} = Ember;

export default Route.extend(
	ApplicationWrapperClassNamesMixin,
	{
		wikiVariables: inject.service(),
		applicationWrapperClassNames: ['search-result-page'],
		queryParams: {
			query: {
				refreshModel: true
			}
		},

		model(params) {
			const model = SearchModel.create({
				host: this.get('wikiVariables.host')
			});

			return model.search(params.query);
		},

		actions: {
			/**
			 * @returns {boolean}
			 */
			didTransition() {
				trackPageView();

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
