import Ember from 'ember';
import {truncate} from '../utils/truncate';
import nl2br from 'common/utils/nl2br';

const {Component, Handlebars, computed} = Ember;

export default Component.extend(
	{
		classNames: ['post-detail'],

		openGraphSiteName: computed.or('post.openGraph.domain', 'post.openGraph.siteName'),

		openGraphImageUrl: computed('post.openGraph.imageUrl', function () {
			const imageWidth = 525,
				imageHeight = parseInt(imageWidth * 9 / 16, 10);

			if (!this.get('post.openGraph.imageUrl')) {
				return '';
			}

			return `${this.get('post.openGraph.imageUrl')}/zoom-crop/width/${imageWidth}/height/${imageHeight}`;
		}),

		parsedContent: computed('post.rawContent', function () {
			let escapedContent = Handlebars.Utils.escapeExpression(
				this.get('post.rawContent')
			).trim();

			escapedContent = truncate(escapedContent, 148);
			escapedContent = nl2br(escapedContent);

			return escapedContent;
		})
	}
);
