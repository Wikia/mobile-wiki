interface LoggerInterface {
	[key: string]: string
}

interface GAAccount {
	// ie. 'UA-32129070-1'
	id: string;
	// namespace prefix for _gaq.push methods, ie. 'special'
	prefix?: string;
	// sampling percentage, from 1 to 100
	sampleRate: number;
}

interface GAAccountMap {
	[name: string]: GAAccount;
}

interface WeppyConfig {
	aggregationInterval: number;
	host: string;
	samplingRate: number;
}

interface LocalSettings {
	apiBase: string;
	asyncArticle: string[];
	backendRequestTimeout: number;
	cdnBaseUrl: string;
	domain: string;
	discuss?: any; //XXX change to interface
	environment: any;
	helios: {
		host: string;
		id: string;
		secret: string;
		usernameMaxLength: number;
		passwordMaxLength: number;
	};
	host: any;
	ironSecret: string;
	mwPreviewSalt: string;
	loggers: LoggerInterface;
	maxRequestsPerChild: number;
	port: number;
	proxyMaxRedirects: number;
	redirectUrlOnNoData: string;
	servicesDomain: string;
	tracking: {
		ua: GAAccountMap;
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
	weppy: WeppyConfig;
	workerCount: number;
	workerDisconnectTimeout: number;
	authCookieDomain?: string;
	devboxDomain?: string;
	mediawikiDomain?: string;
	optimizely?: {
		enabled: boolean;
		scriptPath: string;
		devAccount: string;
		account: string;
	};
	qualaroo?: {
		enabled: boolean;
		scriptUrlDev: string;
		scriptUrlProd: string;
	};
}
