import Ember from 'ember';

import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';
import DiscussionMultipleInputsEditor from './discussion-multiple-inputs-editor';

export default DiscussionMultipleInputsEditor.extend(
	DiscussionEditorOpengraph,
	DiscussionEditorConfiguration,
	{
		attributeBindings: ['style'],
		classNames: ['discussion-inline-editor'],
		classNameBindings: ['isSticky', 'isActive'],
		tagName: 'form',

		currentUser: Ember.inject.service(),

		isActive: false,
		isSticky: false,

		layoutName: 'components/discussion-inline-editor',

		isPostEditor: Ember.computed('isReply', function () {
			return !this.get('isReply');
		}),

		showLabel: Ember.computed('isActive', 'isReply', function () {
			return this.get('isActive') && !this.get('isReply');
		}),

		/**
		 * Returns true if textarea is the only textarea in editor and should appear as first/only one in
		 * collapsed inline editor.
		 * @returns {boolean}
		 */
		showTextareaAsFirstIfAlone: Ember.computed('isActive', 'isReply', function () {
			return this.get('isReply') || this.get('isActive');
		}),

		click(event) {
			this.sendAction('setEditorActive', 'contributeEditor', true);
			this.focusOnNearestTextarea(event);
		},

		actions: {
			submit() {
				if (!this.get('submitDisabled')) {
					const newDiscussionEntityData = {
						body: this.get('content'),
						creatorId: this.get('currentUser.userId'),
						siteId: Mercury.wiki.id,
						title: this.get('title')
					};

					if (this.get('showsOpenGraphCard')) {
						newDiscussionEntityData.openGraph = {
							uri: this.get('openGraph.href')
						};
					}

					this.get('create')(newDiscussionEntityData);
				}
			}
		}
	}
);
