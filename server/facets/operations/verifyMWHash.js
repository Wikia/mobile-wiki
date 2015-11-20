const localSettings = require('../../../config/localSettings'),
	crypto = require('crypto');

/**
 * @param {string} parserOutput
 * @param {string} mwHash
 * @returns {boolean}
 */
exports.verifyMWHash = function (parserOutput, mwHash) {
	const hmac = crypto.createHmac('sha1', localSettings.mwPreviewSalt || ''),
		computedHash = hmac.update(parserOutput).digest('hex');

	return (computedHash === mwHash);
};
