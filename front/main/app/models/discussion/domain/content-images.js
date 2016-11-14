import Ember from 'ember';
import DiscussionContentImage from './content-image';

const {Object} = Ember,
	DiscussionContentImages = Object.extend({});

DiscussionContentImages.reopenClass({
	/**
	 * @param {object[]} contentImagesData
	 *
	 * @returns {Ember.Object}
	 */
	create(contentImagesData) {
		return this._super(contentImagesData.map(contentImageData => {
			DiscussionContentImage.create({
				positon: contentImageData.position,
				url: contentImageData.url
			})
		}));
	}
});

export default DiscussionContentImages;
