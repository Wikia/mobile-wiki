import Ember from 'ember';
import DiscussionStandaloneEditor from './discussion-standalone-editor';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

export default DiscussionStandaloneEditor.extend(
	DiscussionEditorConfiguration,
	{
		editorType: 'guidelinesEditor',
		guidelines: null,
		isGuidelinesEditor: true,
		isReply: false,
		openGraph: null,
		showsOpenGraphCard: false,

		layoutName: 'components/discussion-standalone-editor',

		// first time it is triggered by the 'guidelines' property, and later by the 'isActive' property
		editGuidelinesObserver: Ember.observer('guidelines', 'isActive', function () {
			const guidelines = this.get('guidelines');

			if (!guidelines) {
				return;
			}

			this.set('content', guidelines.get('value'));

			Ember.run.scheduleOnce('afterRender', this, () => {
				// This needs to be triggered after Ember updates textarea content
				this.$('.discussion-standalone-editor-textarea').focus().get(0).setSelectionRange(0, 0);
			});
		}),

		actions: {
			close() {
				this._super();
				this.sendAction('setEditorActive', 'guidelinesEditor', false);
			},

			submit() {
				if (!this.get('submitDisabled')) {
					this.sendAction('saveGuidelines', this.get('content'));
				}
			},
		}
	},
);
