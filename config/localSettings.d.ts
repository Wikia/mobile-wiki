interface CacheInterface {
	engine: any;
	name: string;
	location?: any;
	shared?: boolean;
}

interface LocalSettings {
	host: any;
	port: number;
	maxRequestsPerChild: number;
	workerCount: number;
	environment: any;
	mediawikiHost: string;
	gaId: string;
	cache: CacheInterface;
	wikiFallback: string;
}
