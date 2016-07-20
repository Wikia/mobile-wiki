import Ember from 'ember';
import MainPageRouteMixin from '../mixins/main-page-route';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';
import CuratedContentModel from '../models/curated-content';
import {isNotFoundError} from 'ember-ajax/errors';

const {Route} = Ember;

export default Route.extend(
	MainPageRouteMixin,
	HeadTagsDynamicMixin,
	RouteWithAdsMixin,
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer'],
		
		/**
		 * @param {string} sectionName
		 * @returns {Ember.RSVP.Promise}
		 */
		model({sectionName}) {
			return CuratedContentModel.find(sectionName, 'section');
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
	}
);
