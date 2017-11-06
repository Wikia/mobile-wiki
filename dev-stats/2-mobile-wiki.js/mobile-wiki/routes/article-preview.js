define('mobile-wiki/routes/article-preview', ['exports', 'mobile-wiki/mixins/application-wrapper-class-names', 'mobile-wiki/models/article-preview', 'mobile-wiki/utils/fastboot-caching'], function (exports, _applicationWrapperClassNames, _articlePreview, _fastbootCaching) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Route = Ember.Route,
	    getOwner = Ember.getOwner,
	    inject = Ember.inject;
	exports.default = Route.extend(_applicationWrapperClassNames.default, {
		fastboot: inject.service(),
		logger: inject.service(),
		wikiVariables: inject.service(),

		applicationWrapperClassNames: ['article-preview'],

		model: function model() {
			var shoebox = this.get('fastboot.shoebox');

			if (this.get('fastboot.isFastBoot')) {
				var requestBody = this.get('fastboot._fastbootInfo.request.body');

				var model = _articlePreview.default.create(getOwner(this).ownerInjection());

				(0, _fastbootCaching.disableCache)(this.get('fastboot'));

				return model.articleFromMarkup(requestBody.title, requestBody.wikitext, requestBody.CKmarkup).then(function (articleData) {
					shoebox.put('articleData', articleData);
					return articleData;
				});
			} else {
				return shoebox.retrieve('articleData');
			}
		},


		actions: {
			/**
    * @param {*} error
    * @param {EmberStates.Transition} transition
    * @returns {boolean}
    */
			error: function error(_error, transition) {
				this.get('logger').error(_error);

				if (transition) {
					transition.abort();
				}
			},


			/**
    * @returns {Boolean} returns true
    */
			didTransition: function didTransition() {
				this.controllerFor('application').set('fullPage', true);
				return true;
			}
		}
	});
});