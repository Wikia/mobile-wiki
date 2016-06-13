import Ember from 'ember';
import DiscussionEditor from './discussion-editor';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';

export default DiscussionEditor.extend(DiscussionEditorOpengraph, {
	classNames: ['discussion-standalone-editor'],

	currentUser: Ember.inject.service(),

	actions: {
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
