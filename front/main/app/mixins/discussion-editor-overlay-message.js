import Ember from 'ember';

export default Ember.Mixin.create({
	showOverlayMessage: Ember.computed('isActive', 'calloutMessagePermitted', 'calloutMessageWasSeen', function () {
		return this.get('isActive') && this.get('calloutMessagePermitted') && !this.get('calloutMessageWasSeen');
	}),

	calloutMessageWasSeen: Boolean(localStorage.getItem('discussionEditorCalloutMessageSeen')),

	actions: {
		closeOverlayMessage() {
			this.set('calloutMessageWasSeen', true);
			localStorage.setItem('discussionEditorCalloutMessageSeen', 'wasSeen');
		},
	}
});
