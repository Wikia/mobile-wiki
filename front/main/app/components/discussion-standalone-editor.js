import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionMultipleInputsEditor from './discussion-multiple-inputs-editor';
import DiscussionEditorCategoryPicker from '../mixins/discussion-editor-category-picker';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

const {$, computed, inject, observer, run} = Ember;

export default DiscussionMultipleInputsEditor.extend(
	DiscussionEditorOpengraph,
	DiscussionEditorConfiguration,
	DiscussionEditorCategoryPicker,
	{
		classNames: ['discussion-standalone-editor'],

		currentUser: inject.service(),

		editEntity: null,

		hasTitle: false,

		isEdit: false,

		isReply: computed.bool('editEntity.isReply'),

		pageYOffsetCache: 0,

		responsive: inject.service(),

		categoryTrackingAction: computed('isEdit', function () {
			return this.get('isEdit') ? trackActions.PostCategoryEdited : trackActions.PostCategoryAdded;
		}),

		editorType: computed('isEdit', function () {
			return this.get('isEdit') ? 'editEditor' : 'contributeEditor';
		}),

		editTextDisabled: computed('isEdit', 'editEntity.userData.permissions.canEdit', function () {
			return this.get('isEdit') && !this.get('editEntity.userData.permissions.canEdit');
		}),

		imageWidthMultiplier: computed('isReply', 'responsive.isMobile', function () {
			return this.get('responsive.isMobile') || this.get('isReply') ? 1 : 2;
		}),

		showMultipleInputs: computed('hasTitle', 'isReply', function () {
			return this.get('hasTitle') && !this.get('isReply');
		}),

		// first time it is triggered by the 'editEntity' property, and later by the 'isActive' property
		targetObjectObserver: observer('editEntity', function () {
			const editEntity = this.get('editEntity');

			if (!editEntity) {
				return;
			}

			this.setProperties({
				content: editEntity.get('rawContent'),
				openGraph: editEntity.get('openGraph'),
				showsOpenGraphCard: Boolean(editEntity.get('openGraph')),
				title: editEntity.get('title')
			});

			this.focusFirstTextareaWhenRendered();
		}),

		click(event) {
			this.focusOnNearestTextarea(event);
		},

		focusFirstTextareaWhenRendered() {
			run.scheduleOnce('afterRender', this, () => {
				// This needs to be triggered after Ember updates textarea content
				this.$('textarea:first').focus().get(0).setSelectionRange(0, 0);
			});
		},

		toggleActiveState(isActive) {
			this._super();

			if (isActive) {
				this.set('pageYOffsetCache', window.pageYOffset);
				this.focusFirstTextareaWhenRendered();
			}

			$('html, body').toggleClass('mobile-full-screen', isActive);

			if (navigator.userAgent.indexOf('iPhone') > -1) {
				this.$(`#${this.get('textAreaId')}`).toggleClass('no-overflow', isActive);
			}

			if (!isActive && !this.get(`editorTypesToScrollTopOnScuccess.${this.get('editorType')}`)) {
				if (this.get('responsive.isMobile')) {
					window.scroll(0, this.get('pageYOffsetCache'));
				} else {
					$('html, body').animate({scrollTop: this.get('pageYOffsetCache')});
				}
			}
		},

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
						discussionEntityData.openGraph = this.get('openGraph');
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
