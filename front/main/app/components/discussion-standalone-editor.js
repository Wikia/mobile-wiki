import Ember from 'ember';

import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';
import DiscussionMultipleInputsEditor from './discussion-multiple-inputs-editor';
import DiscussionEditorCategoryPicker from '../mixins/discussion-editor-category-picker';

export default DiscussionMultipleInputsEditor.extend(
	DiscussionEditorOpengraph,
	DiscussionEditorConfiguration,
	DiscussionEditorCategoryPicker, {
		classNames: ['discussion-standalone-editor'],

		currentUser: Ember.inject.service(),

		hasTitle: false,

		isEdit: false,
		isReply: Ember.computed.bool('editEntity.isReply'),
		editorType: Ember.computed('isEdit', function () {
			return this.get('isEdit') ? 'editEditor' : 'contributeEditor';
		}),
		editEntity: null,

		pageYOffsetCache: 0,
		responsive: Ember.inject.service(),

		click(event) {
			this.focusOnNearestTextarea(event);
		},

		onIsActive: Ember.observer('isActive', function () {
			this._super();

			const isActive = this.get('isActive');

			if (isActive) {
				this.set('pageYOffsetCache', window.pageYOffset);
				this.focusFirstTextareaWhenRendered();
			}

			Ember.$('html, body').toggleClass('mobile-full-screen', isActive);

			if (navigator.userAgent.indexOf('iPhone') > -1) {
				this.$(`#${this.get('textAreaId')}`).toggleClass('no-overflow', isActive);
			}

			if (!isActive && !this.get(`editorTypesToScrollTopOnScuccess.${this.get('editorType')}`)) {
				if (this.get('responsive.isMobile')) {
					window.scroll(0, this.get('pageYOffsetCache'));
				} else {
					Ember.$('html, body').animate({scrollTop: this.get('pageYOffsetCache')});
				}
			}
		}),

		// first time it is triggered by the 'editEntity' property, and later by the 'isActive' property
		targetObjectObserver: Ember.observer('editEntity', function () {
			const editEntity = this.get('editEntity');

			if (!editEntity) {
				return;
			}

			this.setProperties({
				category: this.get('categories').findBy('id', this.get('editEntity.categoryId')),
				content: editEntity.get('rawContent'),
				openGraph: editEntity.get('openGraph'),
				showsOpenGraphCard: Boolean(editEntity.get('openGraph')),
				title: editEntity.get('title')
			});

			this.focusFirstTextareaWhenRendered();
		}),

		focusFirstTextareaWhenRendered() {
			Ember.run.scheduleOnce('afterRender', this, () => {
				// This needs to be triggered after Ember updates textarea content
				this.$('textarea:first').focus().get(0).setSelectionRange(0, 0);
			});
		},

		showMultipleInputs: Ember.computed('hasTitle', 'isReply', function () {
			return this.get('hasTitle') && !this.get('isReply');
		}),

		actions: {
			close() {
				this._super();

				this.set('editEntity', null);
				this.sendAction('setEditorActive', this.get('isEdit') ? 'editEditor' : 'contributeEditor', false);
			},

			submit() {
				if (!this.get('submitDisabled')) {
					const discussionEntityData = {
						body: this.get('content'),
						title: this.get('title')
					};
					let actionName,
						editedEntity;

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

						editedEntity = editEntity;
						discussionEntityData.id = editEntity.get('id');

						if (editEntity.get('isReply')) {
							actionName = 'editReply';
						} else {
							actionName = 'editPost';
							discussionEntityData.threadId = editEntity.get('threadId');
						}
					}

					const params = {
						editedEntity,
						newCategoryId: this.get('category.id'),
						newCategoryName: this.get('category.name'),
					};

					this.sendAction(actionName, discussionEntityData, params);
				}
			},
		}
	});
