define('mobile-wiki/routes/article-edit', ['exports', 'mobile-wiki/mixins/full-page', 'mobile-wiki/models/article-edit', 'mobile-wiki/utils/track', 'mobile-wiki/mixins/head-tags-dynamic'], function (exports, _fullPage, _articleEdit, _track, _headTagsDynamic) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var getOwner = Ember.getOwner,
	    Route = Ember.Route;
	exports.default = Route.extend(_fullPage.default, _headTagsDynamic.default, {
		wikiVariables: Ember.inject.service(),
		i18n: Ember.inject.service(),
		/**
   * @param {*} params
   * @returns {Ember.RSVP.Promise}
   */
		model: function model(params) {
			return _articleEdit.default.create(getOwner(this).ownerInjection()).load(params.title, params.sectionIndex);
		},


		/**
   * Custom implementation of HeadTagsMixin::setDynamicHeadTags
   * @param {Object} model, this is model object from route::afterModel() hook
   * @returns {void}
   */
		setDynamicHeadTags: function setDynamicHeadTags(model) {
			this._super(model, { robots: 'noindex,follow' });
		},


		/**
   * @returns {void}
   */
		renderTemplate: function renderTemplate() {
			this.render('article-edit', {
				controller: 'articleEdit'
			});
		},


		actions: {
			/**
    * @returns {boolean}
    */
			error: function error() {
				this.controllerFor('application').addAlert({
					message: this.get('i18n').t('edit.load-error'),
					type: 'alert'
				});

				(0, _track.track)({
					action: _track.trackActions.impression,
					category: 'sectioneditor',
					label: 'edit-load-error'
				});

				return true;
			}
		}
	});
});