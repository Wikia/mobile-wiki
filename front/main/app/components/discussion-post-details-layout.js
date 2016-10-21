import Ember from 'ember';
import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import ResponsiveMixin from '../mixins/responsive';
import {track, trackActions} from '../utils/discussion-tracker';

const {Component, inject} = Ember;

export default Component.extend(
	DiscussionModalDialogMixin,
	ResponsiveMixin,
	{
		discussionSort: inject.service(),
		actions: {
			clickAllDiscussions() {
				track(trackActions.AllDiscussionsLinkClicked);
			}
		}
	}
);
