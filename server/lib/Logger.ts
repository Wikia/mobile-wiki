import bunyan = require('bunyan');
import localSettings = require('../../config/localSettings');

var logger = null,
	availableTargets = {
		syslog: createSysLogLogger,
		console: createConsoleLogger
	};

function createConsoleLogger(loggerConfig) {
	var PrettyStream = require('bunyan-prettystream'),
		prettyStdOut = new PrettyStream();
	prettyStdOut.pipe(process.stdout);
	return {
		level: loggerConfig.level || 'debug',
		stream: prettyStdOut
	};
}

function createSysLogLogger(loggerConfig) {
	var bsyslog = require('bunyan-syslog');
	return {
		level: loggerConfig.level || 'debug',
		type: 'raw',
		stream: bsyslog.createBunyanStream({
			facility: bsyslog.local0,
			type: 'sys'
		})
	};
}

function createLogger (loggerConfig) {
	var streams = [];
	Object.keys(loggerConfig).forEach((loggerType) => {
		if (!availableTargets.hasOwnProperty(loggerType)) {
			throw new Error('Unknown logger type ' + loggerType);
		}
		streams.push(availableTargets[loggerType](loggerConfig[loggerType]));
	});
	return 	bunyan.createLogger({
		name: 'mercury',
		streams: streams
	});
}

if (!logger) {
	logger = createLogger(localSettings.loggers);
}

export = logger;
