import Ember from 'ember';
import DiscussionContentImage from './content-image';

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
			.map(contentImageData => {
				return Object.create({
					position: contentImageData.position,
					url: contentImageData.url
				})
			});

		return this._super({images});
	}
});

export default DiscussionContentImages;
