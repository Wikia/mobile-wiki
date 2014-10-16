interface BSyslog {
	local0: number;
	createBunyanStream (settings: any): BunyanLogger;
}

declare module 'bunyan-syslog' {

	var bsyslog: BSyslog;

	export = bsyslog;
}
