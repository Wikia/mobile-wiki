// TODO: This is a mock logger. Add proper logging to Kibana

declare module Logger {
	interface LoggerFunction {
		(...args: any[]): void;
	}

	var emergency:  LoggerFunction;
	var alert: LoggerFunction;
	var critical: LoggerFunction;
	var error: LoggerFunction;
	var warning: LoggerFunction;
	var notice: LoggerFunction;
	var info: LoggerFunction;
	var debug: LoggerFunction;
}

module Logger {
	function log(loggerType: string): LoggerFunction {
		return (...args: any[]): void => {
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
