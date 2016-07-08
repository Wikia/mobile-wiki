import Ember from 'ember';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	actions: {
		generateOpenGraph(uri) {
			const model = this.modelFor(this.get('routeName')).current;

			return model.generateOpenGraph(uri).then((openGraph) => {
				return openGraph;
			});
		}
	}
});
