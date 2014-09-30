interface BunyanLoggerStream {
	level: string;
	stream: any;
}

interface LoggerFunction {
	(...args: any[]): void;
}

interface BunyanLogger {
	fatal: LoggerFunction;
	error: LoggerFunction;
	warn: LoggerFunction;
	info: LoggerFunction;
	debug: LoggerFunction;
	trace: LoggerFunction;
}

interface Bunyan {
	createLogger (settings: any): BunyanLogger;
}

declare var bunyan: Bunyan;

declare module 'bunyan' {
	export = bunyan;
}
