import Ember from 'ember';

const {Object, A} = Ember,
	DiscussionContentImages = Object.extend({
		images: A()
	});

DiscussionContentImages.reopenClass({
	/**
	 * @param {object[]} contentImagesData
	 *
	 * @returns {Ember.Object}
	 */
	create(contentImagesData) {
		const images = A(contentImagesData)
			.sortBy('position')
			.map(data => {
				return Object.create({
					id: data.id,
					position: data.position,
					url: data.url
				})
			});

		return this._super({images});
	}
});

export default DiscussionContentImages;
