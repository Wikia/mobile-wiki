/// <reference path="../../typings/bunyan/bunyan.d.ts" />

import bunyan = require('bunyan');
import localSettings = require('../../config/localSettings');

interface CreateBunyanLoggerStream {
	(minLogLevel: string): BunyanLoggerStream;
}

interface AvailableTargets {
	[key: string]: CreateBunyanLoggerStream;
}

module Logger {

	var availableTargets: AvailableTargets = {
			default: createDefaultLogStream,
			syslog: createSysLogStream,
			console: createConsoleStream
		};

	function createDefaultLogStream(minLogLevel: string = 'info') {
		return {
			stream: process.stderr,
			level: minLogLevel
		};
	}

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

	export function createLogger(loggerConfig: LoggerInterface) {
		var streams: Array<BunyanLoggerStream> = [];
		Object.keys(loggerConfig).forEach((loggerType: string) => {
			if (!availableTargets.hasOwnProperty(loggerType)) {
				throw new Error('Unknown logger type ' + loggerType);
			}
			streams.push(availableTargets[loggerType](loggerConfig[loggerType]));
		});
		if (streams.length === 0) {
			streams.push(createDefaultLogStream());
		}
		return bunyan.createLogger({
			name: 'mercury',
			streams: streams
		});
	}

}

var logger = Logger.createLogger(localSettings.loggers);

export = logger;
