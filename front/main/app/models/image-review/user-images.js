import Ember from 'ember';
import request from 'ember-ajax/request';

const UserImagesModel = Ember.Object.extend({
	username: '',
	images: []
});

function coppaStatus(status) {
	if (status !== 'REJECTED') {
		return 'ACCEPTED';
	}
	return status;
}

function capitalize(str) {
	if (str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}
	return str;
}

UserImagesModel.reopenClass({

	imagesFor(username) {
		return request(M.getImageReviewServiceUrl(`/user/${capitalize(username)}/images`))
			.then((payload) => {
				const linkRegexp = new RegExp('(http|https)?:\/\/[^\s]+');
				const images = payload.images.map((img) => Ember.Object.create({
					imageId: img.imageId,
					fullSizeImageUrl: img.imageUrl,
					context: img.context,
					source: img.source,
					isContextProvided: Boolean(img.context),
					isContextLink: linkRegexp.test(img.context),
					status: coppaStatus(img.currentStatus)
				}));
				return UserImagesModel.create({images, username});
			});
	},

	reviewUserImages(images) {
		const removedImages = images
			.filter((img) => img.status === 'REJECTED')
			.map(({imageId}) => imageId);
		if (removedImages.length > 0) {
			return request(M.getImageReviewServiceUrl('/user/images/removed'), {
				method: 'POST',
				dataType: 'text',
				data: JSON.stringify({removedImages})
			});
		} else {
			return Ember.RSVP.resolve();
		}
	}

});

export default UserImagesModel;
