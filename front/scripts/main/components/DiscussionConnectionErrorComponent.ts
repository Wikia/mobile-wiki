/// <reference path="../app.ts" />
'use strict';

App.DiscussionConnectionErrorComponent = Em.Component.extend({
	classNames: ['discussion-error'],

	actions: {
		retry: function (): void {
			this.sendAction('retry');
		}
	}

});
