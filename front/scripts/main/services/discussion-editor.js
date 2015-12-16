import App from '../app';

export default Ember.Object.extend({
	isEditorOpen: false,

	/**
	 * Opens post / reply editor
	 * @returns {void}
	 */
	setEditorOpen() {
		this.set('isEditorOpen', true);

		Ember.$('.discussion-editor').addClass('is-active');

		Ember.run.next(this, () => {
			/*
			 iOS hack for position: fixed - now we display loading icon.
			 */
			if (/iPad|iPhone|iPod/.test(navigator.platform)) {
				Ember.$('html, body').css({
					height: '100%',
					overflow: 'hidden'
				});
			}
			Ember.$('.editor-textarea').focus();
		});
	},

	/**
	 * Closes post / reply editor
	 * @returns {void}
	 */
	setEditorClosed() {
		this.set('isEditorOpen', false);

		Ember.$('.discussion-editor').removeClass('is-active');

		Ember.$('html, body').css({
			height: '',
			overflow: ''
		});
		Ember.$('.editor-textarea').blur();
	}
});
