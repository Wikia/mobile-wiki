import Ember from 'ember';
import BaseModel from './base'
import {normalizeToWhitespace} from 'common/utils/string';

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
				fileUsageList: get(data, 'nsSpecificContent.fileUsageList'),
				fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
				// TODO cast to bool
				hasArticle: get(data, 'article.content.length'),
				heroImage: {
					url: get(data, 'details.thumbnail'),
					title: get(data, 'details.title'),
					width: get(data, 'details.original_dimensions.width'),
					height: get(data, 'details.original_dimensions.height'),
					itemContext: 'file',
					type: get(data, 'details.type'),
					shouldBeLoaded: true
				}
			};
		}

		model.setProperties(pageProperties);
	},
});

export default FileModel;
