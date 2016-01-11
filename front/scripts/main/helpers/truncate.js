import truncate from '../../mercury/utils/truncate';

/**
 * @param {Array} params
 * @returns {string}
 */
export default Ember.Helper.helper((params) => {
	return truncate(params);
});
