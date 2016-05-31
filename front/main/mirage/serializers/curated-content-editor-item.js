import BaseSerializer from './application';

export default BaseSerializer.extend({
	// without it keyForCollection isn't called (ember-cli-mirage bug?)
	embed: true,
	keyForCollection() {
		return 'data';
	}
});
