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
	environment: any;
	mediawikiHost: string;
	cache: CacheInterface;
	proxyMaxRedirects: number;
	wikiFallback: string;
	apiBase: string;
	workerDisconnectTimeout: number;
	backendRequestTimeout: number;
	loggers: LoggerInterface;
	tracking: {
		gaId: string;
		quantserve: string;
	}
}
