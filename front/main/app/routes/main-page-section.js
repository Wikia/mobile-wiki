import Ember from 'ember';
import MainPageRouteMixin from '../mixins/main-page-route';
import HeadTagsMixin from '../mixins/head-tags';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import CuratedContentModel from '../models/curated-content';

export default Ember.Route.extend(MainPageRouteMixin, HeadTagsMixin, RouteWithAdsMixin, {
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return CuratedContentModel.find(params.sectionName, 'section');
	},

	/**
	 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
	 * @param {Object} model, this is model object from route::afterModel() hook
	 * @returns {void}
	 */
	setDynamicHeadTags(model) {
		this._super(model, {robots: 'noindex,follow'});
	},

	actions: {
		/**
		 * @param {*} error
		 * @returns {boolean}
		 */
		error(error) {
			if (error && error.status === 404) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-section-not-found'),
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
