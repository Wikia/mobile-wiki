function resultWrapper (err, result) {
	result.status = err ? (err.code || err.exception.code || err.statusCode || 500) : 200;
	result.message = err ? err : 'success';
	return result;
}

export = resultWrapper;
