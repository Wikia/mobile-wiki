function getStatusCode(result: any, defaultCode: number = 200): number {
	var exception = result.exception;
	return exception ? (exception.code || exception.statusCode || 500) : defaultCode;
}

export = getStatusCode;
