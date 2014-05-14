interface ServerOptions {
	app?: any;
	cache?: any;
	cors?: any;
	security?: any;
	debug?: any;
	files?: any;
	json?: any;
	labels?: string;
	load?: any;
	location?: string;
	payload?: any;
	plugins?: any;
	router?: any;
	state?: any;
	timeout?: any;
	views?: any;
}

declare class HapiServer {
	pack: {
		require(name: string, options: {}, callback: Function): void;
	};
	route(options: {
		path: string;
		method: string;
		handler: any;
		lookupCompressed?: boolean;
		proxy?: any;
	}): void;
	start(callback?: Function): void;
	info: any
}

declare module "hapi" {

	export function createServer (host: string, port: number, options?: ServerOptions): HapiServer;
}
