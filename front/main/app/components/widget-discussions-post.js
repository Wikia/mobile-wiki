import Ember from 'ember';

export default Ember.Component.extend(
	{
		classNames: ['post-detail'],

		openGraphSiteName: Ember.computed.or('post.openGraph.domain', 'post.openGraph.siteName'),

		openGraphImageUrl: Ember.computed('post.openGraph.imageUrl', function () {
			const imageWidth = 525,
				imageHeight = parseInt(imageWidth * 9 / 16, 10);

			if (!this.get('post.openGraph.imageUrl')) {
				return '';
			}

			return `${this.get('post.openGraph.imageUrl')}/zoom-crop/width/${imageWidth}/height/${imageHeight}`;
		}),
	}
);
