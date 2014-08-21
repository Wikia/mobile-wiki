// TODO: This is a mock logger. Add proper logging to Kibana

interface LoggerFunction {
	(...args: any[]): void;
}

interface Logger {
	emergency: LoggerFunction;
	alert: LoggerFunction;
	critical: LoggerFunction;
	error: LoggerFunction;
	warning: LoggerFunction;
	notice: LoggerFunction;
	info: LoggerFunction;
	debug: LoggerFunction;
}

module Logger {

	function log(loggerType: string) {
		return () => {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('[' + loggerType + ']');
			console.log.apply(this, args);
		};
	}

	[
		'emergency',
		'alert',
		'critical',
		'error',
		'warning',
		'notice',
		'info',
		'debug'
	].forEach(function (level) {
		Logger[level] = log(level.toUpperCase());
	});
}

export = Logger;
