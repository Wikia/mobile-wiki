import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import ArticleEditModel from '../models/article-edit';
import {track, trackActions} from 'common/utils/track';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Ember.Route.extend(
	FullPageMixin,
	HeadTagsDynamicMixin,
	{
		/**
		 * @param {*} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			return ArticleEditModel.load(params.title, params.sectionIndex);
		},

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} model, this is model object from route::afterModel() hook
		 * @returns {void}
		 */
		setDynamicHeadTags(model) {
			this._super(model, {robots: 'noindex,follow'});
		},

		/**
		 * @returns {void}
		 */
		renderTemplate() {
			this.render('article-edit', {
				controller: 'articleEdit'
			});
		},

		actions: {
			/**
			 * @returns {boolean}
			 */
			error() {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.edit-load-error'),
					type: 'alert'
				});

				track({
					action: trackActions.impression,
					category: 'sectioneditor',
					label: 'edit-load-error'
				});

				return true;
			}
		}
	}
);
