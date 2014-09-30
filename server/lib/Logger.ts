/// <reference path="../../typings/bunyan/bunyan.d.ts" />

import bunyan = require('bunyan');
import localSettings = require('../../config/localSettings');

interface CreateBunyanLoggerStream {
	(minLogLevel: string): BunyanLoggerStream;
}

interface AvailableTargets {
	[key: string]: CreateBunyanLoggerStream;
};

var logger: BunyanLogger = null,
	availableTargets: AvailableTargets = {
		syslog: createSysLogStream,
		console: createConsoleStream
	};

function createConsoleStream(minLogLevel: string): BunyanLoggerStream {
	var PrettyStream = require('bunyan-prettystream'),
		prettyStdOut = new PrettyStream();
	prettyStdOut.pipe(process.stdout);
	return {
		level: minLogLevel,
		stream: prettyStdOut
	};
}

function createSysLogStream(minLogLevel: string): BunyanLoggerStream {
	var bsyslog = require('bunyan-syslog');
	return {
		level: minLogLevel,
		type: 'raw',
		stream: bsyslog.createBunyanStream({
			facility: bsyslog.local0,
			type: 'sys'
		})
	};
}

function createLogger (loggerConfig: LoggerInterface) {
	var streams: Array<BunyanLoggerStream> = [];
	Object.keys(loggerConfig).forEach((loggerType: string) => {
		if (!availableTargets.hasOwnProperty(loggerType)) {
			throw new Error('Unknown logger type ' + loggerType);
		}
		streams.push(availableTargets[loggerType](loggerConfig[loggerType]));
	});
	return bunyan.createLogger({
		name: 'mercury',
		streams: streams
	});
}

if (!logger) {
	logger = createLogger(localSettings.loggers);
}

export = logger;
