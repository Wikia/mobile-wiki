import Ember from 'ember';
import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';

const {Component} = Ember;

export default Component.extend(
	DiscussionStickyComponentMixin,
	{
		classNames: ['discussion-reply-editor-stub'],
		containerClassname: '.stub-container',
	}
);
