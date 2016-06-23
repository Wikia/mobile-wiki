import DiscussionBaseController from './base';

export default DiscussionBaseController.extend({
	actions: {
		editGuidelines(text) {
			this.get('target').send('editGuidelines', text);
		},
	}
});
