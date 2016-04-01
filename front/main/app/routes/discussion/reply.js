import DiscussionBaseRoute from './base';
import DiscussionPostRoute from './post';

export default DiscussionBaseRoute.extend(
	DiscussionPostRoute,
	{
		controllerName: 'discussion.post',
		templateName: 'discussion.post',
	}
);
