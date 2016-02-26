import Ember from 'ember';

const FandomPostsModel = Ember.Object.extend({
	title: null,
	type: null,
	posts: [],

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'RecirculationApi',
					method: 'getFandomPosts',
					format: 'json',
					type: this.get('type')
				},
				success: (data) => {
					this.setProperties(data);
					resolve(this);
				},
				error: (data) => reject(data)
			});
		});
	}
});

export default FandomPostsModel;
