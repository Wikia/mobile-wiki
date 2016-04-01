/**
 * Helper function to repeat given string
 * @param {string} string
 * @param {number} count
 * @returns {string}
 */
function repeatString(string, count) {
	return new Array(count + 1).join(string);
}

export default class ProofOfWork {
	/**
	 * JS Hashcash implementation
	 * https://en.wikipedia.org/wiki/Hashcash#Technical_details
	 *
	 * @param {string} challenge
	 * @param {number} bits
	 * @returns {object}
	 */
	static proof(challenge, bits) {
		const zeros = Math.floor(bits / 4),
			paddedZeros = repeatString('0', zeros);
		let counter = 0,
			digest,
			out,
			counterHex;

		do {
			counterHex = counter.toString(16);
			digest = CryptoJS.SHA1(`${challenge}${counterHex}`).toString();

			out = {
				counter: counterHex,
				digest
			};
			counter++;
		}
		while (digest.slice(0, zeros) !== paddedZeros);

		return out;
	}
}
