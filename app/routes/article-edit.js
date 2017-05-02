import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import ArticleEditModel from '../models/article-edit';
import {track, trackActions} from '../utils/track';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';


const {getOwner, Route} = Ember;

export default Route.extend(
	FullPageMixin,
	HeadTagsDynamicMixin,
	{
		wikiVariables: Ember.inject.service(),
		i18n: Ember.inject.service(),
		/**
		 * @param {*} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			return ArticleEditModel
				.create(getOwner(this).ownerInjection())
				.load(params.title, params.sectionIndex);
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
					message: this.get('i18n').t('edit.load-error'),
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
