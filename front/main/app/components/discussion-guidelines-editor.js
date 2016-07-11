import Ember from 'ember';
import DiscussionStandaloneEditor from './discussion-standalone-editor';
import DiscussionEditorConfiguration from '../mixins/discussion-editor-configuration';

export default DiscussionStandaloneEditor.extend(
	DiscussionEditorConfiguration,
	{
		isGuidelinesEditor: true,
		isReply: false,
		editorType: 'guidelinesEditor',
		guidelines: null,

		layoutName: 'components/discussion-standalone-editor',

		editGuidelinesObserver: Ember.observer('guidelines', function () {
			const guidelines = this.get('guidelines');

			this.setProperties({
				content: guidelines.get('value'),
				openGraph: null,
				showsOpenGraphCard: false
			});

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
