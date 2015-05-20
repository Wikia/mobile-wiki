/// <reference path="../app.ts" />
'use strict';

App.EditView = Em.View.extend({
	classNames: ['edit-view'],
	init: function(): void {
		this._super();
		Em.run.scheduleOnce('afterRender', this, () => {
			this.adjustTextareaHeight();
		});
	},

	willInsertElement: function (): void {
		Em.$(window).on('resize.editor', () => {
			this.adjustTextareaHeight();
		});
	},

	willDestroyElement: function(): void {
		Em.$(window).off('resize.editor');
	},

	adjustTextareaHeight: function(): void {
		Em.$('textarea').css('height', Em.$(window).height() - Em.$('.edit-head').outerHeight());
	}
});
