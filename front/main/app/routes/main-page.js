import Ember from 'ember';
import MainPageModel from '../models/main-page';
import MainPageRouteMixin from '../mixins/main-page-route';
import VisibilityStateManager from '../mixins/visibility-state-manager';

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
		this.controllerFor('mainPage').setProperties({
			adsContext: model.get('adsContext'),
			isRoot: true,
			ns: model.get('ns'),
			title: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

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
