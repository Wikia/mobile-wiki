import Ember from 'ember';
import MainPageRouteMixin from '../mixins/main-page-route';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import CuratedContentModel from '../models/curated-content';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Ember.Route.extend(MainPageRouteMixin, HeadTagsDynamicMixin, RouteWithAdsMixin, {
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return CuratedContentModel.find(params.categoryName, 'category');
	},

	/**
	 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
	 * @param {Object} model, this is model object from route::afterModel() hook
	 * @returns {void}
	 */
	setDynamicHeadTags(model) {
		this._super(model, {
			robots: 'noindex,follow',
			documentTitle: model.get('title'),
			description: this.get('description')
		});
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
