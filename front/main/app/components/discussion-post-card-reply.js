import DiscussionPostCardBaseComponent from '../mixins/discussion-post-card-base';

export default Ember.Component.extend(DiscussionPostCardBaseComponent, {
	classNames: ['post-reply'],
	classNameBindings: ['isParentDeleted']
});
