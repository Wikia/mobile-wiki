import Ember from 'ember';
import DiscussionReplyStickyComponentMixin from '../mixins/discussion-reply-sticky-component';

const {Component} = Ember;

export default Component.extend(
	DiscussionReplyStickyComponentMixin,
	{
		classNames: ['discussion-reply-editor-stub'],
		containerClassname: '.stub-container',
	}
);
