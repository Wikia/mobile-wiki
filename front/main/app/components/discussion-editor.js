import Ember from 'ember';
import {track} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	tagName: 'form',

	currentUser: Ember.inject.service(),

	content: '',

	showSuccess: false,
	isLoading: false,
	editorType: 'contributeEditor',

	// Labels below needs to be override in subclasses
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

	onIsActive: Ember.observer('isActive', function () {
		if (this.get('isActive')) {
			track(this.get('startTrackingAction'));
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
