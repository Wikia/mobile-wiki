import Ember from 'ember';
import request from 'ember-ajax/request';

const FandomPostsModel = Ember.Object.extend({
	title: null,
	type: null,

	init() {
		this._super(...arguments);
		this.posts = [];
	},

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'RecirculationApi',
				method: 'getFandomPosts',
				format: 'json',
				type: this.get('type')
			}
		}).then((data) => {
			this.setProperties(data);
			return this;
		});
	}
});

export default FandomPostsModel;
