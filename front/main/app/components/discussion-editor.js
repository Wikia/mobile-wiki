import Ember from 'ember';
import {track} from '../utils/discussion-tracker';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';
import DiscussionEditorOverlayMessage from '../mixins/discussion-editor-overlay-message';

export default Ember.Component.extend(
	DiscussionEditorConfiguration,
	DiscussionEditorOverlayMessage,
	{
		tagName: 'form',

		currentUser: Ember.inject.service(),

		content: '',

		showSuccess: false,
		isLoading: false,
		editorType: 'contributeEditor',

		// editor types that need to scroll the page up after successful save action
		editorTypesToScrollTopOnScuccess: {
			contributeEditor: true,
		},

		// Labels below needs to be overwritten in subclasses
		labelMessageKey: null,
		placeholderMessageKey: null,
		submitMessageKey: null,

		// Tracking action name of closing the editor
		closeTrackingAction: null,
		// Tracking action name of inserting content into editor
		contentTrackingAction: null,
		// Tracking action name of opening the editor
		startTrackingAction: null,

		wasContentTracked: false,
		wasStartTracked: false,

		onIsActive: Ember.observer('isActive', function () {
			this.toggleActiveState(this.get('isActive'));
		}),

		toggleActiveState(isActive) {
			if (isActive) {
				track(this.get('startTrackingAction'));
				this.$('textarea:first').focus();
			}
		},

		onIsLoading: Ember.observer('isLoading', function () {
			if (!this.get('isLoading') && !this.get('errorMessage')) {
				this.set('showSuccess', true);

				Ember.run.later(this, 'afterSuccess', 2000);
			}
		}),

		submitDisabled: Ember.computed('content', 'currentUser.isAuthenticated', 'showOverlayMessage',
			'isReply', 'category', 'isGuidelinesEditor', function () {
				return this.getWithDefault('content.length', 0) === 0 ||
					this.get('currentUser.isAuthenticated') === false ||
					this.get('showOverlayMessage') ||
					(!this.get('isReply') && !this.get('category.id') && !this.get('isGuidelinesEditor'));
			}
		),

		afterSuccess() {
			this.setProperties({
				content: '',
				showSuccess: false,
			});
			this.sendAction('setEditorActive', this.get('editorType'), false);

			if (this.get(`editorTypesToScrollTopOnScuccess.${this.get('editorType')}`)) {
				this.scrollAfterEntityAdded();
			}
		},

		/**
		 * @returns {void}
		 */
		scrollAfterEntityAdded() {
			Ember.$('html, body').animate({scrollTop: 0});
		},

		actions: {
			close() {
				track(this.get('closeTrackingAction'));
				this.toggleActiveState(false);
			},

			focusTextarea() {
				this.$('textarea:first').focus();
			},

			handleKeyPress() {
				if (!this.get('wasContentTracked')) {
					track(this.get('contentTrackingAction'));
					this.set('wasContentTracked', true);
				}

				if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
					// Create post on CTRL + ENTER
					this.send('submit');
				}
			}
		}
	}
);
