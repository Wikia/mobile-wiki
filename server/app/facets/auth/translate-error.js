export default function translateError(data, customError) {
	const statusCode = data.response.statusCode,
		step = data.step,
		errors = [];

	if (step === 'service-discovery') {
		errors.push('server-error');
	} else if (step === 'user-discovery') {
		if (statusCode === 404) {
			errors.push('username-not-recognized');
		} else {
			errors.push('server-error');
		}
	} else if (step === 'update-password') {
		if (statusCode === 400) {
			const payload = JSON.parse(data.payload);

			if (payload.errors && payload.errors.length) {
				payload.errors.map(error => {
					return customError(error);
				}).filter((value, index, array) => {
					return array.indexOf(value) === index;
				}).forEach(key => {
					errors.push(key);
				});
			}
		} else if (statusCode === 403) {
			errors.push('token-expired');
		} else {
			errors.push('server-error');
		}
	} else {
		const payload = JSON.parse(data.payload);

		if (payload.errors && payload.errors.length) {
			payload.errors.forEach(error => {
				errors.push(error.description.replace('_', '-'));
			});
		} else {
			errors.push('server-error');
		}
	}

	return errors;
}
