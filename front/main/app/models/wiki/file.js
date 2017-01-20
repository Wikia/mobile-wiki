import Ember from 'ember';
import BaseModel from './base';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';
import {extractEncodedTitle} from 'main/utils/url';

const {get, computed} = Ember,
	FileModel = BaseModel.extend({
		hasArticle: false,
		heroImage: null,
		fileUsageList: null,
		fileUsageListSeeMoreUrl: null,
	});

FileModel.reopenClass({
	/**
	 * @param {CategoryModel} model
	 * @param {Object} pageData
	 * @returns {void}
	 */
	setData(model, pageData) {
		this._super(...arguments);
		const exception = pageData.exception,
			data = pageData.data;

		let pageProperties;

		if (!exception && data) {
			// This data should always be set - no matter if file has an article or not
			pageProperties = {
				articleType: get(data, 'file'),
				fileUsageList: get(data, 'nsSpecificContent.fileUsageList')
					.map(this.prepareFileUsageItem),
				fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
				fileMedia: MediaModel.create({
					media: get(data, 'nsSpecificContent.media')
				}),
				hasArticle: get(data, 'article.content.length') > 0,
				heroImage: {
					// TODO check if this is the right image
					url: get(data, 'details.thumbnail'),
					title: get(data, 'details.title'),
					width: get(data, 'details.original_dimensions.width'),
					height: get(data, 'details.original_dimensions.height'),
					itemContext: 'file',
					type: get(data, 'details.type'),
					shouldBeLoaded: true,
					fileRef: 0
				}
			};
		}

		model.setProperties(pageProperties);
	},

	prepareFileUsageItem(item) {
		return {
			title: get(item, 'titleText'),
			snippet: get(item, 'snippet'),
			prefixedTitle: extractEncodedTitle(get(item, 'url'))
		};
	}
});

export default FileModel;
