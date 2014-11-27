/// <reference path="../app.ts" />
'use strict';

Em.LinkView.reopen({
	attributeBindings: ['data-tracking-category'],

	//it allows to use action='x' actionParam='y' in link-to helper
	action: null,
	_invoke: function (event: Event): boolean {
		var action: string = this.get('action');
		if (action) {
			// There was an action specified (in handlebars) so take custom action
			event.preventDefault(); // prevent the browser from following the link as normal
			if (this.bubbles === false) {
				event.stopPropagation();
			}

			// trigger the action on the controller
			this.get('origContext').send(action, this.get('actionParam'));
			return false;
		}

		// no action to take, handle the link-to normally
		return this._super(event);
	}
});
