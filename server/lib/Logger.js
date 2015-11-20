/**
 * @typedef {Object} BunyanLoggerStream
 * @property {WritableStream} stream
 * @property {string} level
 */

const localSettings = require('../../config/localSettings'),

	/**
	 * Logger interface
	 */
	Logger = {
		availableTargets: {
			default: Logger.createDefaultLogStream,
			syslog: Logger.createSysLogStream,
			console: Logger.createConsoleStream
		},

		/**
		 * Creates the default log stream settings
		 *
		 * @param {string} minLogLevel
		 * @returns {BunyanLoggerStream}
		 */
		createDefaultLogStream(minLogLevel = 'info') {
			return {
				level: minLogLevel,
				stream: process.stderr
			};
		},

		/**
		 * Creates the console log settings
		 *
		 * @param {string} minLogLevel
		 * @returns {BunyanLoggerStream}
		 */
		createConsoleStream(minLogLevel) {
			const PrettyStream = require('bunyan-prettystream'),
				prettyStdOut = new PrettyStream();

			prettyStdOut.pipe(process.stdout);
			return {
				level: minLogLevel,
				stream: prettyStdOut
			};
		},

		/**
		 * Create the SysLog stream settings
		 *
		 * @param {string} minLogLevel
		 * @returns {BunyanLoggerStream}
		 */
		createSysLogStream(minLogLevel) {
			const bsyslog = require('bunyan-syslog');

			return {
				level: minLogLevel,
				type: 'raw',
				stream: bsyslog.createBunyanStream({
					facility: bsyslog.local0,
					type: 'sys'
				})
			};
		},

		/**
		 * Create logger
		 *
		 * @param {LoggerInterface} loggerConfig
		 * @returns {BunyanLogger}
		 */
		createLogger(loggerConfig) {
			const bunyan = require('bunyan'),
				streams = [];

			/**
			 * @param {string} loggerType
			 * @returns {void}
			 */
			Object.keys(loggerConfig).forEach((loggerType) => {
				if (!Logger.availableTargets.hasOwnProperty(loggerType)) {
					throw new Error(`Unknown logger type ${loggerType}`);
				}
				streams.push(Logger.availableTargets[loggerType](Logger.loggerConfig[loggerType]));
			});
			if (streams.length === 0) {
				streams.push(Logger.createDefaultLogStream());
			}
			return bunyan.createLogger({
				name: 'mercury',
				streams
			});
		}
	};

exports.logger = Logger.createLogger(localSettings.loggers);
exports.createLogger = Logger.createLogger;
