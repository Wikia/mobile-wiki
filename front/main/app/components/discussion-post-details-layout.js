import Ember from 'ember';
import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

const {Component, inject} = Ember;

export default Component.extend(DiscussionModalDialogMixin, {
	discussionSort: inject.service()
});
