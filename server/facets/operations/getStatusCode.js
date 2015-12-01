/**
 * @param {*} result
 * @param {number} [defaultCode=200]
 * @returns {number}
 */
export default function getStatusCode(result, defaultCode = 200) {
	const exception = result.exception;

	return exception ? (exception.code || exception.statusCode || 500) : defaultCode;
}
