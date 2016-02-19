import Ember from 'ember';
import MainPageModel from '../models/main-page';
import MainPageRouteMixin from '../mixins/main-page-route';
import VisibilityStateManager from '../utils/visibility-state-manager';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';

export default Ember.Route.extend(MainPageRouteMixin, {
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	model() {
		return MainPageModel.find();
	},

	/**
	 * @param {MainPageModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		const articleType = model.get('articleType'),
			namespace = model.get('ns');

		this.controllerFor('mainPage').setProperties({
			adsContext: model.get('adsContext'),
			isRoot: true,
			ns: model.get('ns'),
			title: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

		if (typeof namespace !== 'undefined') {
			UniversalAnalytics.setDimension(25, namespace);
		}

		if (articleType) {
			UniversalAnalytics.setDimension(19, articleType);
		}

		if (!model.isCuratedMainPage) {
			// This is needed for articles
			VisibilityStateManager.reset();
		}
	},

	/**
	 * @param {*} controller
	 * @param {MainPageModel} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		if (model.isCuratedMainPage) {
			this.render('main-page', {
				controller: 'mainPage',
				model
			});
		} else {
			this.render('article', {
				view: 'article',
				model
			});
		}
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

			Ember.Logger.warn('Route error', error.stack || error);
			return true;
		}
	}
});
