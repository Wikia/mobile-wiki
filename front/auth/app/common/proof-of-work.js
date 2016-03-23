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
	static proof(challenge, bits) {
		const zeros = Math.floor(bits / 4.0),
			paddedZeros = repeatString('0', zeros);
		let counter = 0,
			digest,
			out;

		do {
			digest = sha1(`${challenge}${counter.toString(16)}`);

			out = {
				counter: counter.toString(16),
				digest
			};
			counter++;
		}
		while (digest.slice(0, zeros) !== paddedZeros);

		return out;
	}
}
