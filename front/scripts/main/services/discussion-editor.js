export default Ember.Service.extend({
	isAnon: true,
	isEditorOpen: false,
	isUserBlocked: false,

	/**
	 * Removes focus from editor textarea.
	 * @returns {void}
	 */
	textareaBlur() {
		Ember.$('.editor-textarea').blur();
	},

	/**
	 * Sets focus for editor textarea.
	 * @returns {void}
	 */
	textareaFocus() {
		Ember.$('.editor-textarea').focus();
	},

	/**
	 * Renders a message to display to an anon
	 * @returns {void}
	 */
	rejectAnon() {
		this.textareaBlur();
		this.openDialog('editor.post-error-anon-cant-post');
	},

	/**
	 * Renders a message to display to a blocked user
	 * @returns {void}
	 */
	rejectBlockedUser() {
		this.textareaBlur();
		this.openDialog('editor.post-error-not-authorized');
	},

	/**
	 * Opens a browser alert with translated message
	 * @param {string} message
	 * @returns {void}
	 */
	openDialog(message) {
		alert(i18n.t(message, {ns: 'discussion'}));
	},

	/**
	 * iOS hack for position: fixed - now we display loading icon.
	 * @returns {void}
	 */
	setEditorOpenIPadHack() {
		if (/iPad|iPhone|iPod/.test(navigator.platform)) {
			Ember.$('html, body').css({
				height: '100%',
				overflow: 'hidden'
			});
		}
	},

	/**
	 * iOS hack for position: fixed removed [see: this.setEditorOpenIPadHack]
	 * @returns {void}
	 */
	removeEditorOpenIPadHack() {
		if (/iPad|iPhone|iPod/.test(navigator.platform)) {
			Ember.$('html, body').css({
				height: '',
				overflow: ''
			});
		}
	},

	/**
	 * Opens post / reply editor
	 * @returns {void}
	 */
	setEditorOpen() {
		this.set('isEditorOpen', true);

		Ember.$('.discussion-editor').addClass('is-active');
		Ember.run.next(this, () => {
			this.setEditorOpenIPadHack();
			this.textareaFocus();
		});
	},

	/**
	 * Closes post / reply editor
	 * @returns {void}
	 */
	setEditorClosed() {
		this.set('isEditorOpen', false);

		Ember.$('.discussion-editor').removeClass('is-active');
		this.removeEditorOpenIPadHack();
		this.textareaBlur();
	},

	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		if (this.get('isEditorOpen') === true) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
		} else if (this.get('isUserBlocked')) {
			this.rejectBlockedUser();
		} else {
			this.setEditorOpen();
		}
	},

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		if (active === true) {
			this.activateEditor();
		} else {
			this.setEditorClosed();
		}
	}
});
