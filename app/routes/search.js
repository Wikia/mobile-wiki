import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import {getOwner} from '@ember/application';
import {scheduleOnce} from '@ember/runloop';
import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import SearchModel from '../models/search';
import {track, trackActions, trackPageView} from '../utils/track';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Route.extend(
	ApplicationWrapperClassNamesMixin,
	HeadTagsDynamicMixin,
	{
		initialPageView: service(),
		i18n: service(),

		queryParams: {
			query: {
				refreshModel: true
			}
		},

		applicationWrapperClassNames: null,

		init() {
			this._super(...arguments);
			this.applicationWrapperClassNames = ['search-result-page'];
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
				scheduleOnce('afterRender', this, () => {
					trackPageView(this.get('initialPageView').isInitialPageView());

					track({
						action: trackActions.impression,
						category: 'app',
						label: 'search'
					});
				});

				return true;
			}
		},

		setDynamicHeadTags(model) {
			const data = {
				htmlTitle: this.get('i18n').t('main.search-input-label', {ns: 'search'})
			};

			this._super(model, data);
		},
	}
);
