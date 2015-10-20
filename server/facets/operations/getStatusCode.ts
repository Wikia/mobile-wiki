function getStatusCode(result: any): number {
	var exception = result.exception;
	return exception ? (exception.code || exception.statusCode || 500) : 200;
}

export = getStatusCode;
