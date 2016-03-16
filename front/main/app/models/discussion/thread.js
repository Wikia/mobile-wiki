import Ember from 'ember';
import DiscussionItem from 'item';


const DiscussionThread = Ember.object.extend({
	count: null,
	forumId: null,
	contributors: null,
	pageNum: null,
	pivotId: null,
	post: null,
	replies: null,
});

export default DiscussionThread;
