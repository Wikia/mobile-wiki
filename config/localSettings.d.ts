interface LoggerInterface {
	[key: string]: string
}

interface GAAccount {
	// namespace prefix for _gaq.push methods, ie. 'special'
	prefix?: string;
	// ie. 'UA-32129070-1'
	id: string;
	// sampling percentage, from 1 to 100
	sampleRate: number;
}

interface GAAccountMap {
	[name: string]: GAAccount;
}

interface LocalSettings {
	apiBase: string;
	backendRequestTimeout: number;
	environment: any;
	host: any;
	loggers: LoggerInterface;
	mediawikiHost: string;
	maxRequestsPerChild: number;
	port: number;
	proxyMaxRedirects: number;
	tracking: {
		ga: GAAccountMap;
		quantserve: string;
		comscore: {
			keyword: string;
			id: string;
			c7: string;
			c7Value: string;
		}
	};
	wikiFallback: string;
	redirectUrlOnNoData: string;
	workerCount: number;
	workerDisconnectTimeout: number;
}
