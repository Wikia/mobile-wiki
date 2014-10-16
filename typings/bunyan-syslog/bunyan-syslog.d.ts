interface BSyslog {
	local0: number;
	createBunyanStream (settings: any): BunyanLogger;
}

declare var bsyslog: BSyslog;

declare module 'bunyan-syslog' {
	export = bsyslog;
}
