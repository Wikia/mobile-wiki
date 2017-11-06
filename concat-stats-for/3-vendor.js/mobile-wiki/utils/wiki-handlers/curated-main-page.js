define('mobile-wiki/utils/wiki-handlers/curated-main-page', ['exports', 'mobile-wiki/models/curated-content'], function (exports, _curatedContent) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object;
	var get = Ember.get;
	var getOwner = Ember.getOwner;


	/**
  * Set curatedContent data if main page has curated content set
  * @param {Object} mainPageModel
  * @returns {Object}
  */
	function getCuratedContentModel(mainPageModel) {
		var curatedContent = get(mainPageModel, 'curatedMainPageData.curatedContent');

		if (curatedContent) {
			return _curatedContent.default.create(getOwner(mainPageModel).ownerInjection(), {
				type: 'section',
				items: curatedContent.items
			});
		}

		return EmberObject.create();
	}

	/**
  * @param {Ember.Route} route
  * @param {Object} model
  * @returns {Object}
  */
	function afterModel(route, model) {
		model.set('curatedContent', getCuratedContentModel(model));

		route.controllerFor('main-page').setProperties({
			adsContext: model.get('adsContext'),
			ns: model.get('ns')
		});

		return model;
	}

	exports.default = {
		// template's and controller's name
		controllerName: 'main-page',
		viewName: 'main-page',
		// hooks
		afterModel: afterModel
	};
});