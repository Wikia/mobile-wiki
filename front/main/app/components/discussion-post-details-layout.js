import Ember from 'ember';
import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import ResponsiveMixin from '../mixins/responsive';

const {Component, inject} = Ember;

export default Component.extend(
	DiscussionModalDialogMixin,
	ResponsiveMixin,
	{
		discussionSort: inject.service()
	}
);
