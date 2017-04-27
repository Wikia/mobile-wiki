import Ember from 'ember';
import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import SearchModel from '../models/search';
import {track, trackActions, trackPageView} from '../utils/track';

const {getOwner, Route} = Ember;

export default Route.extend(
	ApplicationWrapperClassNamesMixin,
	{
		applicationWrapperClassNames: ['search-result-page'],
		queryParams: {
			query: {
				refreshModel: true
			}
		},

		model(params) {
			const model = SearchModel.create(getOwner(this).ownerInjection(), {dupa: true});

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
