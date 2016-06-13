import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	tagName: 'form',

	currentUser: Ember.inject.service(),

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
	// TODO add tracking for start
	startTrackingAction: trackActions.PostStart,
	wasContentTracked: false,
	wasStartTracked: false,

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

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('content', 'currentUser.userId', function () {
		return this.get('content').length === 0 || this.get('currentUser.userId') === null;
	}),

	actions: {
		close() {
			this.sendAction('setEditorActive', false);

			track(this.get('closeTrackingAction'));
		},

		handleKeyPress() {
			if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('submit');
			}
		}
	}
});
