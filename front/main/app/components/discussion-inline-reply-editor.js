import Ember from 'ember';
import DiscussionReplyStickyComponentMixin from '../mixins/discussion-reply-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

const {Component} = Ember;

export default DiscussionInlineEditor.extend(
	DiscussionReplyStickyComponentMixin,
	{
		classNames: ['discussion-inline-reply-editor'],
		containerClassname: '.discussion-inline-editor-floating-container',

		layoutName: 'components/discussion-inline-editor',
	}
);
