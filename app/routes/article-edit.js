import {inject as service} from '@ember/service';
import {getOwner} from '@ember/application';
import Route from '@ember/routing/route';
import FullPageMixin from '../mixins/full-page';
import ArticleEditModel from '../models/article-edit';
import {track, trackActions} from '../utils/track';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';


export default Route.extend(
	FullPageMixin,
	HeadTagsDynamicMixin,
	{
		wikiVariables: service(),
		i18n: service(),

		/**
		 * @param transition
		 */
		beforeModel(transition) {
			if (!transition.data.title) {
				transition.data.title = decodeURIComponent(transition.params['article-edit'].title);
			}
		},

		/**
		 * @param {*} params
		 * @param transition
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params, transition) {
			return ArticleEditModel
				.create(getOwner(this).ownerInjection())
				.load(transition.data.title, params.section_index);
		},

		/**
		 * @returns {void}
		 */
		renderTemplate() {
			this.render('article-edit', {
				controller: 'article-edit'
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
		},

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} modesl, this is model object from route::afterModel() hook
		 * @returns {void}
		 */
		setDynamicHeadTags(model) {
			this._super(model, {robots: 'noindex,follow'});
		}
	}
);
