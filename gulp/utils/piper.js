var pipe = require('multipipe');

/**
 * @returns {void}
 */
function pipeWithErrorHandling() {
	Array.prototype.push.call(arguments, function (err) {
		if (err) {
			throw new Error(err);
		}
	});

	return pipe.apply(null, arguments);
}

module.exports = pipeWithErrorHandling;
