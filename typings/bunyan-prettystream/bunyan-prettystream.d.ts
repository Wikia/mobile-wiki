class PrettyStream {
	pipe(any):any;
}

var prettyStream: PrettyStream;

declare module 'bunyan-prettystream' {
	export = prettyStream;
}
