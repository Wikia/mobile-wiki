import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import ArticleEditModel from '../models/article-edit';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Route.extend(FullPageMixin, {
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return ArticleEditModel.load(params.title, params.sectionIndex);
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
});
