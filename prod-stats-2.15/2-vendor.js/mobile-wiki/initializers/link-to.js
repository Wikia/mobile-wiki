define('mobile-wiki/initializers/link-to', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;
	var LinkComponent = Ember.LinkComponent;


	/**
  * @returns {void}
  */
	function initialize() {
		if (typeof FastBoot !== 'undefined') {
			return;
		}

		LinkComponent.reopen({
			// it allows to use action='x' actionParam='y' in link-to helper
			action: null,

			_invoke: function _invoke(event) {
				var action = this.get('action'),
				    trackingCategory = this.get('trackingCategory'),
				    trackingLabel = this.get('trackingLabel');

				if (action) {
					// There was an action specified (in handlebars) so take custom action
					if (this.bubbles === false) {
						event.stopPropagation();
					}

					// trigger the action on the controller
					this.sendAction('action', this.get('actionParam'));
				}

				if (trackingCategory) {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: trackingCategory,
						label: trackingLabel
					});
				}

				return this._super(event);
			}
		});
	}

	exports.default = {
		name: 'link-to',
		initialize: initialize
	};
});