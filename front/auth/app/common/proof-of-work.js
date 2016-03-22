function repeatString(string, count) {
	return new Array(count + 1).join(string);
}

export default class ProofOfWork {
	static proof(challenge, bits) {
		const zeros = Math.floor(bits / 4.0),
			paddedZeros = repeatString('0', zeros);
		let counter = 0;

		while (true) {
			let digest = sha1(challenge + counter.toString(16)) + '';

			if (digest.slice(0, zeros) == paddedZeros) {
				return {
					counter: counter.toString(16),
					digest: digest
				};
			}
			counter++;
		}
	}
}
