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
	mediawikiDomain?: string;
	devboxDomain?: string;
	environment: any;
	helios: {
		host: string;
		id: string;
		secret: string;
	};
	ironSecret: string;
	host: any;
	mwPreviewSalt: string;
	loggers: LoggerInterface;
	maxRequestsPerChild: number;
	optimizely?: {
		enabled: boolean;
		scriptPath: string;
		devAccount: string;
		account: string;
	};
	port: number;
	proxyMaxRedirects: number;
	redirectUrlOnNoData: string;
	tracking: {
		ga: GAAccountMap;
		quantserve: string;
		comscore: {
			keyword: string;
			id: string;
			c7: string;
			c7Value: string;
		};
		krux: {
			mobileId: string;
		}
	};
	verticalColors: any;
	wikiFallback: string;
	workerCount: number;
	workerDisconnectTimeout: number;
	cdnBaseUrl: string;
}
