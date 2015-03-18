import localSettings = require('../../../config/localSettings');
import crypto = require('crypto');

function verifyMWHash (parserOutput: string, mwHash: string) {
	var hmac = crypto.createHmac('sha1', localSettings.mwPreviewSalt),
		computedHash = hmac.update(parserOutput).digest('hex');

	return (computedHash === mwHash);
}

export = verifyMWHash;
