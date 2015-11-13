/// <reference path="../app.ts" />
/// <reference path="../mixins/ThemeMixin.ts" />

'use strict';

/**
 * Sets what is needed for UI on each route on Discussions
 */

App.DiscussionLayoutMixin = Em.Mixin.create(App.ThemeMixin, {
	activate(): void {
		Em.$('body').addClass('discussions');
		this._super();
	},

	deactivate(): void {
		Em.$('body').removeClass('discussions');
		this._super();
	},
});
