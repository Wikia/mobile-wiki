import Ember from 'ember';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	actions: {
		upvote(entity) {
			this.modelFor(this.get('routeName')).upvote(entity);
		}
	}
});
