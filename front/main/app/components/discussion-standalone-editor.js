import Ember from 'ember';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(DiscussionEditorOpengraph, {
	classNames: ['discussion-standalone-editor'],
	tagName: 'form',

	currentUser: Ember.inject.service(),
	discussionEditor: Ember.inject.service(),

	// TODO update labels
	labelMessageKey: 'TODO',
	placeholderMessageKey: 'TODO',
	submitMessageKey: 'TODO',

	content: '',

	showSuccess: false,
	isLoading: false,

	// TODO update actions
	// Tracking action name of closing the editor
	closeTrackingAction: trackActions.PostClose,
	// Tracking action name of inserting content into editor
	contentTrackingAction: trackActions.PostContent,
	// Tracking action name of opening the editor
	startTrackingAction: trackActions.PostStart,
	wasContentTracked: false,
	wasStartTracked: false,

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('content', 'currentUser.userId', function () {
		return this.get('content').length === 0 || this.get('currentUser.userId') === null;
	}),

	/**
	 * Track content changed
	 *
	 * @returns {void}
	 */
	onTextContent: Ember.observer('content', function () {
		if (this.get('content.length') > 0 && !this.get('wasContentTracked')) {
			track(this.get('contentTrackingAction'));
			this.set('wasContentTracked', true);
		}
	}),

	// TODO error message

	actions: {
		close() {
			this.get('discussionEditor').toggleEditor(false);

			track(this.get('closeTrackingAction'));
		},

		submit() {

		},

		handleKeyPress() {
			if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('submit');
			}
		}
	}
});
