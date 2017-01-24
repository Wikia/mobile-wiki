import Ember from 'ember';
import BaseModel from './base';
import MediaModel from '../media';
import {extractEncodedTitle} from 'main/utils/url';

const {get} = Ember,
	FileModel = BaseModel.extend({
		hasArticle: false,
		heroImage: null,
		fileUsageList: null,
		fileUsageListSeeMoreUrl: null
	});

FileModel.reopenClass({
	/**
	 * @param {Model} model
	 * @param {Object} exception
	 * @param {Object} data
	 * @returns {void}
	 */
	setData(model, {exception, data}) {
		this._super(...arguments);
		let pageProperties;

		if (!exception && data) {
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
					media: MediaModel.create({media}),
					mediaRef: 0
				}
			};
		}

		model.setProperties(pageProperties);
	},

	prepareFileUsageItem({titleText: title, snippet, url}) {
		return {
			title,
			snippet,
			prefixedTitle: extractEncodedTitle(url)
		};
	}
});

export default FileModel;
