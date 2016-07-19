import Ember from 'ember';

import DiscussionEditorWithMultipleInputs from './discussion-editor-with-multiple-inputs';
import DiscussionEditorOpengraph from '../mixins/discussion-editor-opengraph';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

export default DiscussionEditorWithMultipleInputs.extend(
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

		click() {
			this.sendAction('setEditorActive', 'contributeEditor', true);
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
