define('mobile-wiki/components/wikia-ui-components/wds-button', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		tagName: 'button',
		classNames: ['wds-button'],
		classNameBindings: ['isSecondary:wds-is-secondary', 'isText:wds-is-text'],
		isSecondary: false,
		isText: false,
		onClick: function onClick() {},


		/**
   * Handles click event on button - calls proper action if passed
   * and tracks this click.
   *
   * @param {Event} event
   * @returns {void}
   */
		click: function click(event) {
			this.trackClick();
			this.get('onClick')(event);
		},
		trackClick: function trackClick() {
			var trackLabel = this.get('trackLabel');

			if (trackLabel) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'wikia-button',
					label: trackLabel
				});
			}
		}
	});
});