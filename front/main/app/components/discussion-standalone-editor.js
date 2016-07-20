import Ember from 'ember';

import DiscussionEditorWithMultipleInputs from './discussion-editor-with-multiple-inputs';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

export default DiscussionEditorWithMultipleInputs.extend(
	DiscussionEditorOpengraph,
	DiscussionEditorConfiguration, {
		classNames: ['discussion-standalone-editor'],

		currentUser: Ember.inject.service(),

		hasTitle: false,
		isEdit: false,
		isReply: Ember.computed.bool('editEntity.isReply'),
		editorType: Ember.computed('isEdit', function () {
			return this.get('isEdit') ? 'editEditor' : 'contributeEditor';
		}),
		editEntity: null,

		click(event) {
			this.get('focusOnNearestTextarea').call(this, event);
		},

		onIsActive: Ember.observer('isActive', function () {
			this._super();

			Ember.$('html, body').toggleClass('mobile-full-screen', this.get('isActive'));
		}),

		editEntityObserver: Ember.observer('editEntity', function () {
			const editEntity = this.get('editEntity');

			this.setProperties({
				content: editEntity.get('rawContent'),
				openGraph: editEntity.get('openGraph'),
				showsOpenGraphCard: Boolean(editEntity.get('openGraph')),
				title: editEntity.get('title')
			});

			Ember.run.scheduleOnce('afterRender', this, () => {
				// This needs to be triggered after Ember updates textarea content
				this.$('.discussion-standalone-editor-textarea').focus().get(0).setSelectionRange(0, 0);
			});
		}),

		showMultipleInputs: Ember.computed('hasTitle', 'isReply', function () {
			return this.get('hasTitle') && !this.get('isReply');
		}),

		actions: {
			close() {
				this._super();

				this.sendAction('setEditorActive', this.get('isEdit') ? 'editEditor' : 'contributeEditor', false);
			},

			submit() {
				if (!this.get('submitDisabled')) {
					const discussionEntityData = {
						body: this.get('content')
					};
					let actionName;

					if (this.get('title')) {
						discussionEntityData.title = this.get('title');
					}

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
