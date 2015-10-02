/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var bunyan = require('bunyan'),
	PrettyStream = require('bunyan-prettystream'),
	bsyslog = require('bunyan-syslog');

function createConsoleStream () {
	var prettyStdOut = new PrettyStream();
	prettyStdOut.pipe(process.stdout);

	return bunyan.createLogger({
		name: 'japan-homepage',
		streams: [{
			level: 'debug',
			type: 'raw',
			stream: prettyStdOut
		}]
	});
}

function createSysLogStream () {
	return bunyan.createLogger({
		name: 'japan-homepage',
		streams: [{
			level: 'debug',
			type: 'raw',
			stream: bsyslog.createBunyanStream({
				facility: bsyslog.facility.local0,
				type: 'sys'
			})
		}]
	});
}

exports.createLogger = function (type) {
	var logger;

	if (type === 'syslog') {
		logger = createSysLogStream();
	} else if (type === 'console') {
		logger = createConsoleStream();
	} else {
		logger = createConsoleStream();
	}

	return {
		register: require('hapi-bunyan'),
		options: {
			logger: logger,
		}
	};
};
