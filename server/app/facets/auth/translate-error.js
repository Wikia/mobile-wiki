function handleUserDiscoveryErrors(statusCode, errors) {
	if (statusCode === 404) {
		errors.push('username-not-recognized');
	} else {
		errors.push('server-error');
	}
}

function handleServerErrors(payload, errors) {
	if (payload.errors && payload.errors.length) {
		payload.errors.forEach(error => {
			if (error.description === 'invalid_email') {
				errors.push('invalid-email');
			} else {
				errors.push('server-error');
			}
		});
	} else {
		errors.push('server-error');
	}
}

export default function translateError(data, customError) {
	const statusCode = data.response.statusCode,
		step = data.step,
		errors = [];

	if (step === 'service-discovery') {
		errors.push('server-error');
	} else if (step === 'user-discovery') {
		handleUserDiscoveryErrors(statusCode, errors);
	} else if (step === 'update-password' || step === 'reset-password') {
		const payload = JSON.parse(data.payload);

		if (statusCode === 400) {
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
		} else if (statusCode === 429) {
			errors.push('reset-password-email-sent');
		} else {
			handleServerErrors(payload, errors);
		}
	} else {
		errors.push('server-error');
	}

	return errors;
}
