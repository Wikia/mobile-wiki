import localSettings from '../../config/localSettings';
import bunyan from 'bunyan';

/**
 * @typedef {Object} BunyanLoggerStream
 * @property {WritableStream} stream
 * @property {string} level
 */

/**
 * Creates the default log stream settings
 *
 * @param {string} minLogLevel
 * @returns {BunyanLoggerStream}
 */
function createDefaultLogStream(minLogLevel = 'info') {
	return {
		level: minLogLevel,
		stream: process.stderr
	};
}

/**
 * Creates the console log settings
 *
 * @param {string} minLogLevel
 * @returns {BunyanLoggerStream}
 */
function createConsoleStream(minLogLevel) {
	const PrettyStream = require('bunyan-prettystream'),
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
 * @param {string} minLogLevel
 * @returns {BunyanLoggerStream}
 */
function createSysLogStream(minLogLevel) {
	const bsyslog = require('bunyan-syslog');

	return {
		level: minLogLevel,
		type: 'raw',
		stream: bsyslog.createBunyanStream({
			facility: bsyslog.local0,
			type: 'sys'
		})
	};
}

const availableTargets = {
	default: createDefaultLogStream,
	syslog: createSysLogStream,
	console: createConsoleStream
};

/**
 * Create logger
 *
 * @param {LoggerInterface} loggerConfig
 * @returns {BunyanLogger}
 */
export function createLogger(loggerConfig) {
	const streams = [];

	/**
	 * @param {string} loggerType
	 * @returns {void}
	 */
	Object.keys(loggerConfig).forEach((loggerType) => {
		if (!availableTargets.hasOwnProperty(loggerType)) {
			throw new Error(`Unknown logger type ${loggerType}`);
		}

		streams.push(availableTargets[loggerType](loggerConfig[loggerType]));
	});

	if (streams.length === 0) {
		streams.push(createDefaultLogStream());
	}

	return bunyan.createLogger({
		appname: 'mercury',
		name: 'mercury',
		streams
	});
}

export default createLogger(localSettings.loggers);
