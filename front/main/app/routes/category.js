import Ember from 'ember';
import CategoryModel from '../models/category';
import VisibilityStateManager from '../mixins/visibility-state-manager';
import {normalizeToUnderscore} from 'common/utils/string';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';

export default Ember.Route.extend({
	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition) {
		const title = transition.params.category.categoryTitle.replace('wiki/', '');

		this.controllerFor('application').send('closeLightbox');

		if (title === Mercury.wiki.mainPageTitle) {
			this.transitionTo('mainPage');
		}

		// If you try to access article with not-yet-sanitized title you can see in logs:
		// `Transition #1: detected abort.`
		// This is caused by the transition below but doesn't mean any additional requests.
		// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
		// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
		if (title.indexOf(' ') > -1) {
			this.transitionTo('category', normalizeToUnderscore(title));
		}
	},

	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return new CategoryModel();
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		const exception = model.exception,
			articleType = model.articleType;

		if (!Ember.isEmpty(exception)) {
			Ember.Logger.warn('Category model error:', exception);
		}

		if (articleType) {
			UniversalAnalytics.setDimension(19, articleType);
		}

		this.controllerFor('application').set('currentTitle', model.get('title'));
		VisibilityStateManager.reset();

	},

	actions: {
		/**
		 * @param {*} error
		 * @param {EmberStates.Transition} transition
		 * @returns {boolean}
		 */
		error(error, transition) {
			if (transition) {
				transition.abort();
			}

			this.controllerFor('application').addAlert({
				message: i18n.t('app.article-error'),
				type: 'alert'
			});

			return true;
		}
	}
});
