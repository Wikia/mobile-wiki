import Ember from 'ember';
import DiscussionEditor from './discussion-editor';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

export default DiscussionEditor.extend(DiscussionEditorOpengraph, DiscussionEditorConfiguration, {
	classNames: ['discussion-standalone-editor'],

	currentUser: Ember.inject.service(),

	isEdit: false,
	isReply: Ember.computed.bool('editEntity.isReply'),
	editorType: Ember.computed('isEdit', function () {
		return this.get('isEdit') ? 'editEditor' : 'contributeEditor';
	}),
	editEntity: null,

	onIsActive: Ember.observer('isActive', function () {
		this._super();

		Ember.$('html, body').toggleClass('mobile-full-screen', this.get('isActive'));
	}),

	// first time it is triggered by the 'editEntity' property, and later by the 'isActive' property
	editEntityObserver: Ember.observer('editEntity', 'isActive', function () {
		const editEntity = this.get('editEntity');

		if (!editEntity) {
			return;
		}

		this.setProperties({
			content: editEntity.get('rawContent'),
			openGraph: editEntity.get('openGraph'),
			showsOpenGraphCard: Boolean(editEntity.get('openGraph')),
		});

		Ember.run.scheduleOnce('afterRender', this, () => {
			// This needs to be triggered after Ember updates textarea content
			this.$('.discussion-standalone-editor-textarea').focus().get(0).setSelectionRange(0, 0);
		});
	}),

	textAreaId: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return 'discussion-standalone-edit-editor-textarea';
		} else {
			return 'discussion-standalone-editor-textarea';
		}
	}),

	actions: {
		close() {
			this._super();

			this.sendAction('setEditorActive', this.get('isEdit') ? 'editEditor' : 'contributeEditor', false);
		},

		submit() {
			if (!this.get('submitDisabled')) {
				const discussionEntityData = {
					body: this.get('content'),
				};
				let actionName;

				if (this.get('showsOpenGraphCard')) {
					discussionEntityData.openGraph = {
						uri: this.get('openGraph.href')
					};
				}

				if (!this.get('isEdit')) {
					actionName = 'create';
					discussionEntityData.creatorId = this.get('currentUser.userId');
					discussionEntityData.siteId = Mercury.wiki.id;
				} else {
					const editEntity = this.get('editEntity');

					if (editEntity.get('isReply')) {
						actionName = 'editReply';
						discussionEntityData.id = editEntity.get('id');
					} else {
						actionName = 'editPost';
						discussionEntityData.id = editEntity.get('threadId');
					}
				}

				this.sendAction(actionName, discussionEntityData);
			}
		},
	}
});
