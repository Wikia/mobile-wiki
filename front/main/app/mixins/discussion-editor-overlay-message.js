import Ember from 'ember';

export default Ember.Mixin.create({
	showOverlayMessage: Ember.computed('isActive', 'calloutMessagePermitted', 'calloutMessageWasSeen', function () {
		return this.get('isActive') && this.get('calloutMessagePermitted') && !this.get('calloutMessageWasSeen');
	}),

	calloutMessageWasSeen: Ember.computed(() => {
		// we need Ember.computed here, because it is used on a couple of pages, and needs to be computed when the
		// component is rendered
		return Boolean(localStorage.getItem('discussionEditorCalloutMessageSeen'));
	}),

	actions: {
		closeOverlayMessage() {
			this.set('calloutMessageWasSeen', true);
			localStorage.setItem('discussionEditorCalloutMessageSeen', 'wasSeen');
		},
	}
});
