/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var bunyan = require('bunyan'),
	PrettyStream = require('bunyan-prettystream'),
	debugStream = require('bunyan-debug-stream'),
	bsyslog = require('bunyan-syslog');

function createCompactStream () {
	return bunyan.createLogger({
		name: 'japan-homepage',
		streams: [{
			level:  'debug',
			type:   'raw',
			stream: debugStream({
				basepath: __dirname,
				forceColor: true
			})
		}],
		serializers: debugStream.serializers
	});
}

function createConsoleStream () {
	var prettyStdOut = new PrettyStream();
	prettyStdOut.pipe(process.stdout);

	return bunyan.createLogger({
		name: 'japan-homepage',
		streams: [{
			level: 'info',
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
	} else if (type === 'console-compact') {
		logger = createCompactStream();
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
