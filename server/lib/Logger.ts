/// <reference path="../../typings/bunyan/bunyan.d.ts" />
/// <reference path="../../typings/bunyan-prettystream/bunyan-prettystream.d.ts" />
/// <reference path="../../typings/bunyan-syslog/bunyan-syslog.d.ts" />

import bunyan = require('bunyan');
import localSettings = require('../../config/localSettings');

interface CreateBunyanLoggerStream {
	(minLogLevel: string): BunyanLoggerStream;
}

interface AvailableTargets {
	[key: string]: CreateBunyanLoggerStream;
}
/**
 * Loogger interface
 */
module Logger {

	var availableTargets: AvailableTargets = {
			default: createDefaultLogStream,
			syslog: createSysLogStream,
			console: createConsoleStream
		};

	/**
	 * Creates the default log stream settings
	 *
	 * @param minLogLevel
	 * @returns {{stream: WritableStream, level: string}}
	 */
	function createDefaultLogStream(minLogLevel: string = 'info'): BunyanLoggerStream {
		return {
			level: minLogLevel,
			stream: process.stderr
		};
	}

	/**
	 * Creates the console log settings
	 *
	 * @param minLogLevel
	 * @returns {{level: string, stream: exports}}
	 */
	function createConsoleStream(minLogLevel: string): BunyanLoggerStream {
		var PrettyStream = require('bunyan-prettystream'),
			prettyStdOut = new PrettyStream();
		prettyStdOut.pipe(process.stdout);
		return {
			level: minLogLevel,
			stream: prettyStdOut
		};
	}

	/**
	 * Create the SysLog stream settings
	 *
	 * @param minLogLevel
	 * @returns {{level: string, type: string, stream: any}}
	 */
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

	/**
	 * Create logger
	 *
	 * @param loggerConfig
	 * @returns {BunyanLogger}
	 */
	export function createLogger(loggerConfig: LoggerInterface): BunyanLogger {
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
