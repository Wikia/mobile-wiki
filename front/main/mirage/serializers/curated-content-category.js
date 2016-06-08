import BaseSerializer from './application';

export default BaseSerializer.extend({
	serialize({attrs}) {
		return attrs;
	}
});
