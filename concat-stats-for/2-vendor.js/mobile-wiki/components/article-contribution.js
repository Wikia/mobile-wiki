define('mobile-wiki/components/article-contribution', ['exports', 'mobile-wiki/mixins/languages', 'mobile-wiki/utils/track'], function (exports, _languages, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend(_languages.default, {
		classNames: ['contribution-container'],
		layoutName: 'components/article-contribution',
		section: null,
		sectionId: null,
		title: null,

		actions: {
			/**
    * Activate section editor
    * If login is required to edit, redirect to login page
    *
    * @returns {void}
    */
			edit: function edit() {
				var section = this.get('section');

				if (this.get('editAllowed')) {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: 'sectioneditor',
						label: 'edit',
						value: section
					});
					this.sendAction('edit', this.get('title'), section);
				} else {
					this.redirectToLogin('edit-section-no-auth');
				}
			}
		},

		openLocation: function openLocation(href) {
			window.location.href = href;
		},


		/**
   * Redirect the user to login page
   * @param {string} trackingLabel use for tracking of event
   * @returns {void}
   */
		redirectToLogin: function redirectToLogin(trackingLabel) {
			var sectionId = this.get('sectionId');
			var href = '/join?redirect=' + encodeURIComponent(window.location.href);

			if (sectionId) {
				href += encodeURIComponent('#' + sectionId);
			}
			href += this.getUselangParam();

			(0, _track.track)({
				action: _track.trackActions.click,
				category: 'sectioneditor',
				label: trackingLabel,
				value: this.get('section')
			});

			this.openLocation(href);
		}
	});
});