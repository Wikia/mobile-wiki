var pipe = require('multipipe');

function pipeWithErrorHandling () {
	Array.prototype.push.call(arguments, function (err) {
		if (err) {
			throw new Error(err);
		}
	});

	return pipe.apply(null, arguments);
}

module.exports = pipeWithErrorHandling;
