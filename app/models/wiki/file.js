import Ember from 'ember';
import BaseModel from './base';
import MediaModel from '../media';
import {extractEncodedTitle} from '../../utils/url';

const {get} = Ember;

export default BaseModel.extend({
	hasArticle: false,
	heroImage: null,
	fileUsageList: null,
	fileUsageListSeeMoreUrl: null,

	/**
	 * @param {Object} data
	 * @returns {void}
	 */
	setData({data}) {
		this._super(...arguments);
		let pageProperties;

		if (data) {
			const media = get(data, 'nsSpecificContent.media');

			// This data should always be set - no matter if file has an article or not
			pageProperties = {
				articleType: 'file',
				fileUsageList: get(data, 'nsSpecificContent.fileUsageList')
					.map(this.prepareFileUsageItem),
				fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
				fileThumbnail: media,
				fileMedia: {
					// This is for lightbox only
					media: MediaModel.create(getOwner(this).ownerInjection(), {media}),
					mediaRef: 0
				}
			};
		}

		this.setProperties(pageProperties);
	},

	prepareFileUsageItem({titleText: title, snippet, url}) {
		return {
			title,
			snippet,
			prefixedTitle: extractEncodedTitle(url)
		};
	}
});
