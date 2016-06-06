import BaseSerializer from './application';

export default BaseSerializer.extend({
	serialize(response) {
		return {
			basepath: response.basepath,
			items: response.attrs.items
		};
	}
});
