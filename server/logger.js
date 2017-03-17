const PrettyStream = require('bunyan-prettystream');
const expressBunyanLogger = require('express-bunyan-logger');

/**
 * @typedef {Object} BunyanLoggerStream
 * @property {string} level
 * @property {WritableStream} stream
 * @property {string} [type]
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
	const prettyStdOut = new PrettyStream();

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
 * @param {Object} loggerConfig
 * @returns {Object}
 */
function createLogger(loggerConfig) {
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

	return expressBunyanLogger({
		appname: 'mobile-wiki',
		name: 'mobile-wiki',
		streams
	});
}

// FIXME prod should use syslog, not console
module.exports = createLogger({
	console: 'debug'
});
