import DiscussionPostRoute from './post';
import DiscussionPostModel from '../../models/discussion/post';

export default DiscussionPostRoute.extend({
	controllerName: 'discussion.post',

	model(params) {
		return DiscussionPostModel.permalink(Mercury.wiki.id, params.postId, params.replyId);
	},

	renderTemplate() {
		this.render('discussion.post');
	}
});
