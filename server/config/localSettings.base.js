import {getEnvironment, stripDevboxDomain} from '../app/lib/Utils';
import deepExtend from 'deep-extend';

/* eslint max-len:0 */

/**
 * Base localSettings for application
 * @example
 * var localConfig = require('./config').localSettings
 */

/**
 * @typedef {string[]} LoggerInterface
 */

/**
 * @typedef {Object} GAAccount
 * @property {string} id - ie. 'UA-32129070-1'
 * @property {string} [prefix] - namespace prefix for _gaq.push methods, ie. 'special'
 * @property {number} sampleRate - sampling percentage, from 1 to 100
 */

/**
 * @typedef {Object} GAAccountConfig
 * @property {GAAccount} primary
 * @property {GAAccount} ads
 * @property {GAAccount} special
 * @property {string} scriptUrl
 */

/**
 * @typedef {Object} WeppyConfig
 * @property {number} aggregationInterval
 * @property {string} host
 * @property {number} samplingRate
 */

/**
 * @typedef {Object} ClickStreamConfig
 * @property {ClickStreamConfigItem} auth
 */

/**
 * @typedef {Object} ClickStreamConfigItem
 * @property {boolean} enable
 * @property {string} url
 */

/**
 * @typedef {Object} LocalSettings
 * @property {string} apiBase
 * @property {string[]} asyncArticle
 * @property {string} [authCookieDomain]
 * @property {number} backendRequestTimeout
 * @property {string} cdnBaseUrl
 * @property {string} [devboxDomain]
 * @property {string} domain
 * @property {*} [discuss]
 * @property {*} environment
 * @property {HeliosLocalSettings} helios
 * @property {WhoAmIServiceLocalSettings} whoAmIService
 * @property {*} host
 * @property {string} ironSecret
 * @property {string} [mediawikiDomain]
 * @property {string} mwPreviewSalt
 * @property {LoggerInterface} loggers
 * @property {number} maxRequestsPerChild
 * @property {OptimizelyLocalSettings} [optimizely]
 * @property {number} port
 * @property {number} proxyMaxRedirects
 * @property {QualarooLocalSettings} [qualaroo]
 * @property {string} [qualaroo]
 * @property {string} redirectUrlOnNoData
 * @property {string} servicesDomain
 * @property {TrackingLocalSettings} tracking
 * @property {*} verticalColors
 * @property {WeppyConfig} weppy
 * @property {number} workerCount
 * @property {number} workerDisconnectTimeout
 * @property {FacebookLocalSettings} facebook
 * @property {PatternsLocalSettings} patterns
 * @property {boolean} enableDiscussions
 * @property {ClickStreamConfig} clickstream
 */

/**
 * @typedef {Object} HeliosLocalSettings
 * @property {string} path
 * @property {number} usernameMaxLength
 * @property {number} passwordMaxLength
 */

/**
 * @typedef {Object} WhoAmIServiceLocalSettings
 * @property {string} path
 * @property {number} timeout
 */

/**
 * @typedef {Object} OptimizelyLocalSettings
 * @property {boolean} enabled
 * @property {string} scriptPath
 * @property {string} account
 */

/**
 * @typedef {Object} QualarooLocalSettings
 * @property {boolean} enabled
 * @property {string} scriptUrl
 */

/**
 * @typedef {Object} TrackingLocalSettings
 * @property {GAAccountConfig} ua
 * @property {string} quantserve
 * @property {ComscoreTrackingLocalSettings} comscore
 * @property {KruxTrackingLocalSettings} krux
 */

/**
 * @typedef {Object} ComscoreTrackingLocalSettings
 * @property {string} keyword
 * @property {string} id
 * @property {string} c7
 * @property {string} c7Value
 */

/**
 * @typedef {Object} KruxTrackingLocalSettings
 * @property {string} mobileId
 */

/**
 * @typedef {Object} FacebookLocalSettings
 * @property {number} appId
 */

/**
 * @typedef {Object} PatternsLocalSettings
 * @property {RegExp} mobile
 * @property {RegExp} iPad
 */

const localSettings = {
	apiBase: '/api/mercury',
	servicesDomain: 'services.wikia.com',
	// Default timeout for backend requests
	// This timeout is the same as the MW app timeout
	backendRequestTimeout: 300000,
	domain: 'wikia.com',
	// Targeted environment [prod|preview|verify|dev|testing]
	environment: getEnvironment(process.env.WIKIA_ENVIRONMENT),
	helios: {
		path: '/auth',
		usernameMaxLength: 50,
		passwordMaxLength: 50
	},
	discuss: {
		baseAPIPath: 'discussion'
	},
	imageReview: {
		baseAPIPath: 'image-review'
	},
	whoAmIService: {
		path: '/whoami',
		timeout: 3000
	},
	ironSecret: 'TEST_SECRET_REPLACE_THIS',
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host: process.env.HOST,
	mediawikiDomain: process.env.MEDIAWIKI_DOMAIN || null,
	// Special salt for accepting HTML from MediaWiki for /editor_preview/
	mwPreviewSalt: process.env.MW_PREVIEW_SALT,
	// By default send logs to local syslog only. Possible targets are [syslog, console, default]
	// The value represent the minimum logging level
	loggers: {
		syslog: 'debug'
	},
	devboxDomain: stripDevboxDomain(process.env.HOST || process.env.LOGNAME),
	// auth pages aren't supported on custom domains, so this value should only be used for auth features
	// once we phase out custom domains, we can change this to "cookieDomain" and use it for more features
	authCookieDomain: '.wikia.com',
	maxRequestsPerChild: parseInt(process.env.MAX_REQUEST_PER_CHILD, 10) || 50000,
	optimizely: {
		enabled: true,
		scriptPath: '//cdn.optimizely.com/js/',
		account: '2449650414'
	},
	qualaroo: {
		enabled: true,
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/bgJ.js'
	},
	port: process.env.PORT || 8000,
	proxyMaxRedirects: 3,
	redirectUrlOnNoData: 'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia',
	tracking: {
		ua: {
			primary: {
				id: 'UA-32129070-1',
				sampleRate: 10
			},
			ads: {
				prefix: 'ads',
				id: 'UA-32129071-1',
				sampleRate: 100
			},
			special: {
				prefix: 'special',
				id: 'UA-32132943-1',
				sampleRate: 100
			},
			scriptUrl: '//www.google-analytics.com/analytics.js'
		},
		quantserve: 'p-8bG6eLqkH6Avk',
		comscore: {
			keyword: 'comscorekw',
			id: '6177433',
			c7: '',
			c7Value: ''
		},
		krux: {
			mobileId: 'JTKzTN3f'
		}
	},
	verticalColors: {
		comics: '#ff5400',
		games: '#94d11f',
		books: '#ff7f26',
		movies: '#09d3bf',
		lifestyle: '#ffd000',
		music: '#c819ad',
		tv: '#00b7e0'
	},
	weppy: {
		enabled: process.env.WIKIA_ENVIRONMENT === 'prod',
		host: 'http://speed.wikia.net/__rum',
		samplingRate: 0.1,
		aggregationInterval: 1000
	},
	workerCount: parseInt(process.env.WORKER_COUNT, 10) || 1,
	workerDisconnectTimeout: 3000,
	// CDN prefix with no trailing slash
	cdnBaseUrl: '//mercury.nocookie.net',
	// array of wiki dbnames to load first article async instead of in page source
	asyncArticle: [],
	facebook: {
		appId: 112328095453510
	},
	patterns: {
		mobile: /(iPhone|Android.*Mobile|iPod|Opera Mini|Opera Mobile|Mobile.*Firefox|Windows CE| Kindle|IEMobile|Symbian|Danger|BlackBerry|BB10|Googlebot-Mobile|Nokia)/,
		iPad: /iPad/
	},
	enableDiscussions: true,
	clickstream: {
		auth: {
			enable: true,
			url: 'https://services.wikia.com/clickstream/events/social'
		}
	},
	translationFiles: ['main', 'discussion', 'image-review']
};

/**
 * @param {LocalSettings} customLocalSet
 * @returns {LocalSettings}
 */
export default function extendSettings(customLocalSet) {
	return deepExtend(localSettings, customLocalSet);
}
