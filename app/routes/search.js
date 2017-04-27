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
			return SearchModel
				.create(getOwner(this).ownerInjection())
				.search(params.query);
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
