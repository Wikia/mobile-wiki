define('mobile-wiki/controllers/article', ['exports', 'mobile-wiki/mixins/wiki-page-controller', 'mobile-wiki/utils/track'], function (exports, _wikiPageController, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var alias = Ember.computed.alias;
	var equal = Ember.computed.equal;
	var Controller = Ember.Controller;
	var controller = Ember.inject.controller;
	exports.default = Controller.extend(_wikiPageController.default, {
		application: controller(),

		commentsPage: alias('application.commentsPage'),
		displayRecirculation: equal('wikiVariables.language.content', 'en'),

		actions: {
			/**
    * @param {string} title
    * @param {number} sectionIndex
    * @returns {void}
    */
			edit: function edit(title, sectionIndex) {
				this.transitionToRoute('articleEdit', title, sectionIndex);

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'sectioneditor',
					label: 'edit',
					value: sectionIndex
				});
			},


			/**
    * @returns {void}
    */
			articleRendered: function articleRendered() {
				this.send('handleLightbox');
			},
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			},
			toggleSiteHeadShadow: function toggleSiteHeadShadow(visible) {
				this.get('application').send('toggleSiteHeadShadow', visible);
			}
		}
	});
});