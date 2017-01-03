import Ember from 'ember';
import rawRequest from 'ember-ajax/raw';
import request from 'ember-ajax/request';

const ImageReviewModel = Ember.Object.extend({
	showSubHeader: true,
    isRejectedQueue: Ember.computed('status', function() {
    	return this.get('status') === 'REJECTED';
	}),

	setImagesCount(status) {
		request(M.getImageReviewServiceUrl('/monitoring', {
			status
		})).then((promise) => {
			this.set('imagesToReviewCount', promise.countByStatus);
		});
	}
});

function getUserPermissions() {
    return request(M.getImageReviewServiceUrl('/info'));
}

function getImageSources() {
	return request(M.getImageReviewServiceUrl('/sources')).catch(() => {
		return { sources: [] };
	});
}

function getBatch(status, order, source) {
	return rawRequest(M.getImageReviewServiceUrl('/batch', { status, order, source }), { method: 'POST' })
		.then(({ payload, jqXHR }) => {
			if (jqXHR.status === 204) {
				return {
					imageList: []
				};
			} else {
				return request(M.getImageReviewServiceUrl(`/batch/${payload.id}`));
			}
		}).then(({ batchId, imageList }) => {
            const linkRegexp = new RegExp('(http|https)?:\/\/[^\s]+');
			const images = imageList
				.filter((image) =>
					['UNREVIEWED', 'QUESTIONABLE', 'REJECTED'].indexOf(image.currentStatus) !== -1)
				.map((image) =>
					Ember.Object.create({
                        batchId,
                        imageId: image.imageId,
                        fullSizeImageUrl: image.imageUrl,
                        context: image.context,
						source: image.source,
                        isContextProvided: Boolean(image.context),
                        isContextLink: linkRegexp.test(image.context),
                        status: status === 'REJECTED' ? 'rejected' : 'accepted'
                    }));

			return {
				batchId,
				images
			};
		});
}

ImageReviewModel.reopenClass({

	startSession(status, order, source) {
		return Ember.RSVP.all([
			getUserPermissions(),
			getImageSources(),
			getBatch(status, order, source)
		]).then(([permissions, sources, batch]) =>
			ImageReviewModel.create(Ember.assign(permissions, sources, batch, { status })));
	},

	reviewImages(images, batchId, status) {
		const imageList = images.map((item) => {
            return {
                imageId: item.imageId,
				imageStatus: (item.status.toUpperCase() === 'REJECTED' && status === 'REJECTED')
                    ? 'REMOVED'
                    : item.status.toUpperCase()
            }
		});

		return request(M.getImageReviewServiceUrl(`/batch/${batchId}`), {
			method: 'POST',
			dataType: 'text', // this is a dirty workaround
			data: JSON.stringify({images: imageList})
		});
	},


});

export default ImageReviewModel;
