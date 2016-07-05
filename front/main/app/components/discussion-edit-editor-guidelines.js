import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';
import {trackActions} from '../utils/discussion-tracker';

export default DiscussionEditorComponent.extend({
	classNames: ['is-edit'],

	discussionEditor: Ember.inject.service('discussion-edit-editor'),

	wasInitialized: false,

	didInsertElement() {
		this._super(...arguments);
		this.get('discussionEditor').on('newGuidelines', this, this.handleGuidelinesEdited);
	},

	willDestroyElement() {
		this.get('discussionEditor').off('newGuidelines', this, this.handleGuidelinesEdited);
	},

	init() {
		this.setProperties({
			closeTrackingAction: trackActions.GuidelinesEditClose,
			contentTrackingAction: trackActions.GuidelinesEditContent,
			labelText: 'editor.guidelines-editor-editor-label',
			placeholderText: 'editor.guidelines-editor-placeholder-text',
			startTrackingAction: trackActions.GuidelinesEdit,
			submitText: 'editor.guidelines-editor-action-button-label',
			titleText: 'editor.guidelines-editor-title',
		});

		this._super();
	},

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {},

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleGuidelinesEdited() {
		this.setProperties({
			isLoading: false,
			showSuccess: true
		});

		Ember.run.later(this, () => {
			this.set('showSuccess', false);

			this.get('discussionEditor').toggleEditor(false);
		}, 2000);
	},

	/**
	 * @returns {void}
	 */
	trackContentAction() {
		if (this.get('wasInitialized')) {
			this._super();
		}
	},

	setOpenGraphProperties(text, urlRegex) {
		if (!this.get('wasInitialized')) {
			return;
		}

		this._super(text, urlRegex);
	},

	/**
	 * Open editor and set bodyText to the right value
	 * @returns {void}
	 */
	afterOpenActions() {
		const guidelines = this.get('discussionEditor.guidelines');

		this._super();

		this.setProperties({
			bodyText: guidelines.get('value'),
			showsOpenGraphCard: false,
		});

		Ember.run.scheduleOnce('afterRender', this, () => {
			// This needs to be triggered after Ember updates textarea content
			this.$('.editor-textarea').get(0).setSelectionRange(0, 0);
			this.set('wasInitialized', true);
		});
	},

	afterCloseActions() {
		this._super();

		this.get('discussionEditor').set('guidelines', null);
		this.set('wasInitialized', false);
	},

	actions: {
		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		submit() {
			if (!this.get('submitDisabled')) {
				this.get('discussionEditor').set('isLoading', true);
				this.get('saveGuidelines')(this.get('bodyText'));
			}
		},
	}
});
