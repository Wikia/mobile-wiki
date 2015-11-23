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

	postBody: '',
	errorMessage: Em.computed.oneWay('requestErrorMessage'),
	layoutName: 'components/discussion-editor',

	getBreakpointHeight(): number {
		return this.offsetTop - (this.get('siteHeadPinned') ? this.siteHeadHeight : 0);
	},

	/**
	 * Display error message on post failure
	 */
	errorMessageObserver: Em.observer('errorMessage', function(): void {
		if (this.get('errorMessage')) {
			alert(i18n.t(this.get('errorMessage'), {ns: 'discussion'}));
		}
		this.set('isLoading', false);
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
				submitDisabled: this.get('postBody').length === 0 || this.get('currentUser.userId') === null,
				isActive: true
			});
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @returns {void}
		 */
		handleKeyPress(event: KeyboardEvent) :void {
			if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('create');
			}
		}
	}
});
