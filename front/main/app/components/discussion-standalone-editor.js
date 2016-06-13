import Ember from 'ember';
import DiscussionEditor from './discussion-editor';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';

export default DiscussionEditor.extend(DiscussionEditorOpengraph, {
	classNames: ['discussion-standalone-editor'],

	currentUser: Ember.inject.service(),

	isEdit: false,
	textAreaId: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return "discussion-standalone-edit-editor-textarea";
		} else {
			return "discussion-standalone-editor-textarea";
		}
	}),

	actions: {
		close() {
			this.sendAction('setEditorActive', this.get('isEdit') ? 'editEditor' : 'contributeEditor', false);

			// TODO fix tracking
			track(this.get('closeTrackingAction'));
		},

		submit() {
			if (!this.get('submitDisabled')) {
				const newDiscussionEntityData = {
					body: this.get('content'),
					creatorId: this.get('currentUser.userId'),
					siteId: Mercury.wiki.id,
				};

				if (this.get('showsOpenGraphCard')) {
					newDiscussionEntityData.openGraph = {
						uri: this.get('openGraph.href')
					};
				}

				this.get('create')(newDiscussionEntityData);
			}
		},
	}
});
