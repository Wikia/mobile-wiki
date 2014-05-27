/// <reference path="../node/node.d.ts" />
declare module Hapi {
	export interface ServerOptions {
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

	export class Server {
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

	export interface Request {
		app: any;
		auth: {
			isAuthenticated: boolean;
			credentials: Object;
			artifacts: Object;
			session: Object
		};
		domain: any;
		headers: Object;
		id: number;
		info: {
			received: number;
			remoteAddress: string;
			remotePort: number;
			referrer: string;
			host: string;
		};
		method: string;
		mime?: string;
		params: any;
		path: string;
		payload: any;
		plugins: Object;
		pre: Object;
		response: Object;
		responses: Object;
		query: Object;
		raw: {
			req: any; //http.ClientRequest
			res: any; //http.ClientResponse
		};
		route: string;
		server: Server;
		session: any;
		state: Object;
		url: Object;

		setUrl? (url: string): void;
		setMethod? (method: string): void;
		log (tags: string, data?: string, timestamp?: number): void;
		log (tags: string, data?: Object, timestamp?: number): void;
		log (tags: string[], data?: string, timestamp?: number): void;
		log (tags: string[], data?: Object, timestamp?: number): void;
		getLog(): string[];
		getLog(tag: string): string[];
		getLog(tags: string[]): string[];
		tail(name?: string): Function;
	}

	export interface Response {
		statusCode: number;
		headers: Object;
		source: any;
		variety: string;
		app: any;
		plugins: Object;
		settings: {
			encoding: string;
			charset: string;
			location: string;
			ttl: number;
			stringify: any;
			passThrough: boolean;
		}

		code (statusCode: number): void;
		header (name: string, value: string, options?: {
			append: boolean;
			separator: string;
			override: boolean;
		}): void;
		type (mimeType: string): void;
		bytes (length: number): void;
		vary (header: string): void;
		location (location: string): void;
		created (location: string): void;
		redirect (location: string): void;
		encoding (encoding: string): void;
		charset (charset: string): void;
		ttl (ttl: number): void;
		state (name: string, value: string, options?: any): void;
		unstate (name: string): void;

		replacer (method: Function): void;
		replacer (method: Array<Function>): void;
		spaces (count: number): void;

		temporary (isTemporary: boolean): void;
		permanent (isPermanent: boolean): void;
		rewritable (isRewritable: boolean): void;
	}

	export module reply {
		function file(path: string, options: {
			filePath: string;
			options: {
				filename: string;
				mode: string
			}
		}): void;

		function view(template: string, context?: Object, options?: Object): Response;
		function close(options?: Object): void;
		function proxy(options: Object): void;

		export function reply(result: any);
	}

	export function createServer (host: string, port: number, options?: ServerOptions): Server;
}

declare module "hapi" {
	export = Hapi;
}
