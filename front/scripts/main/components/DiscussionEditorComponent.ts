/// <reference path="../app.ts" />
'use strict';

App.DiscussionEditorComponent = Em.Component.extend(App.ViewportMixin, {

	classNameBindings: ['isActive', 'hasError'],

	isActive: false,
	isSticky: false,

	submitDisabled: true,
	isLoading: false,
	showSuccess: false,
	hasError: false,

	offsetTop: 0,
	siteHeadHeight: 0,

	layoutName: 'components/discussion-editor',

	getBreakpointHeight(): number {
		return this.offsetTop - (this.get('siteHeadPinned') ? this.siteHeadHeight : 0);
	},

	/**
	 * Handle post creation error
	 * @returns {void}
	 */
	errorObserver: Em.observer('shouldShowError', function (): void {
		if (this.get('shouldShowError')) {
			this.setProperties({
				isLoading: false,
				hasError: true
			});
		}
	}),

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click(): void {
		this.$('.editor-textarea').focus();
	},

	actions: {
		/**
		 * Enable/disable editor
		 * @returns {void}
		 */
		toggleEditorActive(active: boolean): void {
			this.set('isActive', active);
		},

		/**
		 * Update editor when typing - activate editor and activate submit button
		 * @returns {void}
		 */
		updateOnInput(): void {
			this.setProperties({
				submitDisabled: this.$('.editor-textarea').val().length === 0,
				isActive: true
			});
		},
	}
});
