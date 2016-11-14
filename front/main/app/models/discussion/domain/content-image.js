import Ember from 'ember';

const {Object} = Ember,
	DiscussionContentImage = Object.extend({
		position: 0,
		url: null
	});

DiscussionContentImage.reopenClass({
	/**
	 * @param {object} contentImageData
	 *
	 * @returns {Ember.Object}
	 */
	create(contentImageData) {
		return this._super({
			position: contentImageData.position,
			url: contentImageData.url
		});
	}
});

export default DiscussionContentImage;
