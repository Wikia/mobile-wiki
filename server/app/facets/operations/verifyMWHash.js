import localSettings from '../../../config/localSettings';
import {createHmac} from 'crypto';

/**
 * @param {string} parserOutput
 * @param {string} mwHash
 * @returns {boolean}
 */
export default function verifyMWHash(parserOutput, mwHash) {
	const hmac = createHmac('sha1', localSettings.mwPreviewSalt || ''),
		computedHash = hmac.update(parserOutput).digest('hex');

	return (computedHash === mwHash);
}
