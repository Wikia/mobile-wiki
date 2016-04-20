import Ember from 'ember';
import MetaTagsMixin from '../mixins/main-page-route';
import MainPageRouteMixin from '../mixins/meta-tags';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import CuratedContentModel from '../models/curated-content';

export default Ember.Route.extend(MainPageRouteMixin, MetaTagsMixin, RouteWithAdsMixin, {
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model({categoryName}) {
		return CuratedContentModel.find(categoryName, 'category');
	},

	/**
	 * @returns {*}
	 */
	meta() {
		return {
			name: {
				robots: 'noindex, follow'
			}
		};
	},

	actions: {
		/**
		 * @param {*} error
		 * @returns {boolean}
		 */
		error(error) {
			// Status comes from ArticlesApiController::getList in MediaWiki
			// and code comes from MercuryApiController in MW and server side code in Mercury app
			if (error && (error.status === 404 || error.code === 404)) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-category-not-found'),
					type: 'warning',
					persistent: true,
				});
			} else {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'warning',
					persistent: true,
				});
			}

			this.transitionTo('wiki-page', '');
			return true;
		}
	}
});
