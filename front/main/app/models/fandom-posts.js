import Ember from 'ember';
import request from 'ember-ajax/request';

const FandomPostsModel = Ember.Object.extend({
	title: null,
	type: 'recent_popular',
	thumbSize: 'full',

	init() {
		this._super(...arguments);
		this.items = [];
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
			this.setProperties(this.formatData(data));
			return this;
		});
	},

	formatData(data) {
		const items = data.posts.map((item, index) => {
			item.index = index;
			item.thumbnail = this.get('thumbSize') === 'medium' ? item.thumb_url_medium : item.image_url;
			return item;
		});

		return {
			title: data.title,
			items
		};
	},
});

export default FandomPostsModel;
