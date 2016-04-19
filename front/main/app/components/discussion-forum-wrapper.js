import Ember from 'ember';
import DiscussionWrapperComponentMixin from '../mixins/discussion-wrapper-component';
import DiscussionEditEditorMixin from '../mixins/discussion-edit-editor';

export default Ember.Component.extend(
	DiscussionWrapperComponentMixin,
	DiscussionEditEditorMixin
);
