import Ember from 'ember';
import MainPageRouteMixin from '../mixins/main-page-route';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import CuratedContentModel from '../models/curated-content';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import {isNotFoundError} from 'ember-ajax/errors';

export default Ember.Route.extend(MainPageRouteMixin, HeadTagsDynamicMixin, RouteWithAdsMixin, {
	/**
	 * @param {string} categoryName
	 * @returns {Ember.RSVP.Promise}
	 */
	model({categoryName}) {
		return CuratedContentModel.find(categoryName, 'category');
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
			description: this.get('mainPageDescription')
		});
	},

	actions: {
		/**
		 * @param {*} error
		 * @returns {boolean}
		 */
		error(error) {
			if (isNotFoundError(error)) {
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
