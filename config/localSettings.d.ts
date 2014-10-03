interface CacheInterface {
	engine: any;
	name: string;
	location?: any;
	shared?: boolean;
}

interface LoggerInterface {
	[key: string]: string
}

interface LocalSettings {
	host: any;
	port: number;
	maxRequestsPerChild: number;
	workerCount: number;
	environment: string;
	mediawikiHost: string;
	gaId: string;
	cache: CacheInterface;
	proxyMaxRedirects: number;
	wikiFallback: string;
	apiBase: string;
	workerDisconnectTimeout: number;
	loggers: LoggerInterface;
	isProduction: boolean;
}
