import Ember from 'ember';

const {Object, A} = Ember,
	DiscussionContentImages = Object.extend({
		images: null
	});

DiscussionContentImages.reopenClass({
	/**
	 * @param {object[]} contentImagesData
	 * @returns {Ember.Object}
	 */
	create(contentImagesData) {
		const images = new A(contentImagesData)
			.sortBy('position')
			.map(data => {
				return Object.create({
					id: data.id,
					height: data.height,
					position: data.position,
					url: data.url,
					visible: true,
					width: data.width
				});
			});

		return this._super({images});
	},

	/**
	 * Converts array of Ember.Object (images) to data representation
	 *
	 * @param {object[]} contentImages
	 *
	 * @returns object[]
	 */
	toData(contentImages) {
		return contentImages.filterBy('visible')
			.map(image => {
				return {
					height: image.height,
					position: image.position,
					url: image.url,
					width: image.width
				};
			});
	}
});

export default DiscussionContentImages;
