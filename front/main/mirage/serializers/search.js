import BaseSerializer from './application';

export default BaseSerializer.extend({
	serialize(response) {
		return response.attrs;
	}
});
