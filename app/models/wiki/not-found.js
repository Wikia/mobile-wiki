import BaseModel from './base';
import {normalizeToWhitespace} from '../../utils/string';

const NotFoundModel = BaseModel.extend();

NotFoundModel.reopenClass({
	/**
	 * @param {NotFoundModel} model
	 * @returns {void}
	 */
	setData(model) {
		const normalizedTitle = normalizeToWhitespace(decodeURIComponent(model.title));

		model.setProperties({
			displayTitle: normalizedTitle,
			htmlTitle: normalizedTitle,
			notFound: true
		});
	}
});

export default NotFoundModel;
