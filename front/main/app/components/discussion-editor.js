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
	editorType: 'contributeEditor',

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

	onIsLoading: Ember.observer('isLoading', function () {
		if (!this.get('isLoading')) {
			this.set('showSuccess', true);

			Ember.run.later(this, 'afterSuccess', 2000);
		}
	}),

	/**
	 * @returns {boolean}
	 */
	submitDisabled: Ember.computed('content', 'currentUser.userId', function () {
		return this.get('content').length === 0 || this.get('currentUser.userId') === null;
	}),

	afterSuccess() {
		this.setProperties({
			content: '',
			showSuccess: false,
		});
		this.sendAction('setEditorActive', this.get('editorType'), false);
		Ember.$('html, body').animate({scrollTop: 0});
	},

	actions: {
		close() {
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
