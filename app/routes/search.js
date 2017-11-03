import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import {getOwner} from '@ember/application';
import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import SearchModel from '../models/search';
import {track, trackActions, trackPageView} from '../utils/track';

export default Route.extend(
	ApplicationWrapperClassNamesMixin,
	{
		applicationWrapperClassNames: ['search-result-page'],
		queryParams: {
			query: {
				refreshModel: true
			}
		},

		initialPageView: service(),

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
				trackPageView(this.get('initialPageView').isInitialPageView());

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
