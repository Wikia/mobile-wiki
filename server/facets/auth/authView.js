const caching = require('../../lib/Caching'),
	localSettings = require('../../../config/localSettings'),
	url = require('url');

/**
 * @typedef {string[]} PageParams
 */

/**
 * @typedef {Object} AuthViewContext
 * @property {string} title
 * @property {string} canonicalUrl
 * @property {string} language
 * @property {string} exitTo
 * @property {string} mainPage
 * @property {string} optimizelyScript
 * @property {PageParams} pageParams
 * @property {boolean} [hideHeader]
 * @property {boolean} [hideFooter]
 * @property {string} [footerHref]
 * @property {string} [footerCallout]
 * @property {string} [footerCalloutLink]
 * @property {string} [headerText]
 * @property {string} [bodyClasses]
 * @property {string} [pageType]
 * @property {string} [parentOrigin]
 * @property {boolean} [standalone]
 * @property {*} [trackingConfig]
 */

exports.VIEW_TYPE_MOBILE = 'mobile';
exports.VIEW_TYPE_DESKTOP = 'desktop';

/**
 * @param {string} template
 * @param {AuthViewContext} context
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
exports.view = function (template, context, request, reply) {
	const response = reply.view(
		`auth/${this.getViewType(request)}/${template}`,
		context,
		{
			layout: 'auth'
		}
	);

	caching.disableCache(response);
	return response;
};

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getRedirectUrl = function (request) {
	const currentHost = request.headers.host,
		redirectUrl = request.query.redirect || '/',
		redirectUrlHost = url.parse(redirectUrl).host;

	if (!redirectUrlHost ||
		this.checkDomainMatchesCurrentHost(redirectUrlHost, currentHost) ||
		this.isWhiteListedDomain(redirectUrlHost)
	) {
		return redirectUrl;
	}

	// Not valid domain
	return '/';
};

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getOrigin = function (request) {
	const currentHost = request.headers.host,
		redirectUrl = request.query.redirect || '/',
		redirectUrlHost = url.parse(redirectUrl).host,
		redirectUrlOrigin = `${url.parse(redirectUrl).protocol}//${redirectUrlHost}`;

	if (redirectUrlHost && (
			this.checkDomainMatchesCurrentHost(redirectUrlHost, currentHost) ||
			this.isWhiteListedDomain(redirectUrlHost)
		)
	) {
		return redirectUrlOrigin;
	}

	return this.getCurrentOrigin(request);
};

/**
 * @param {string} domain
 * @param {string} currentHost
 * @returns {boolean}
 */
exports.checkDomainMatchesCurrentHost = function (domain, currentHost) {
	return currentHost === domain ||
		domain.indexOf(`.${currentHost}`, domain.length - currentHost.length - 1) !== -1;
};

/**
 * @param {string} domain
 * @returns {boolean}
 */
exports.isWhiteListedDomain = function (domain) {
	const whiteListedDomains = ['.wikia.com', '.wikia-dev.com'];

	/**
	 * @param {string} whileListedDomain
	 * @returns {boolean}
	 */
	return whiteListedDomains.some((whiteListedDomain) => {
		return domain.indexOf(whiteListedDomain, domain.length - whiteListedDomain.length) !== -1;
	});
};

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getCurrentOrigin = function (request) {
	// for now the assumption is that there will be https
	return `https://${request.headers.host}`;
};

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getCanonicalUrl = function (request) {
	return this.getCurrentOrigin(request) + request.path;
};

/**
 * @param {Hapi.Request} request
 * @returns {AuthViewContext}
 */
exports.getDefaultContext = function (request) {
	const viewType = this.getViewType(request),
		isModal = request.query.modal === '1';

	/* eslint no-undefined: 0 */
	return {
		title: null,
		canonicalUrl: this.getCanonicalUrl(request),
		exitTo: this.getRedirectUrl(request),
		mainPage: 'http://www.wikia.com',
		language: request.server.methods.i18n.getInstance().lng(),
		trackingConfig: localSettings.tracking,
		optimizelyScript: `${localSettings.optimizely.scriptPath}${localSettings.optimizely.account}.js`,
		standalonePage: (viewType === this.VIEW_TYPE_DESKTOP && !isModal),
		pageParams: {
			cookieDomain: localSettings.authCookieDomain,
			isModal,
			enableAuthLogger: localSettings.clickstream.auth.enable,
			authLoggerUrl: localSettings.clickstream.auth.url,
			viewType,
			parentOrigin: (isModal ? this.getOrigin(request) : undefined)
		}
	};
};


/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {*}
 */
exports.validateRedirect = function (request, reply) {
	const queryRedirectUrl = this.getRedirectUrl(request);

	if (request.query.redirect && queryRedirectUrl !== request.query.redirect) {
		request.url.query.redirect = queryRedirectUrl;
		request.url.search = null;
		return reply.redirect(request.url.format()).takeover();
	}

	return reply();
};


/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getViewType = function (request) {
	const mobilePattern = localSettings.patterns.mobile,
		ipadPattern = localSettings.patterns.iPad;

	if (mobilePattern.test(request.headers['user-agent']) && !ipadPattern.test(request.headers['user-agent'])) {
		return this.VIEW_TYPE_MOBILE;
	}
	return this.VIEW_TYPE_DESKTOP;
};


/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @param {AuthViewContext} context
 * @returns {Hapi.Response}
 */
exports.onAuthenticatedRequestReply = function (request, reply, context) {
	const redirect = this.getRedirectUrl(request);

	if (context.pageParams.isModal) {
		return reply.view(
			'auth/desktop/modal-message',
			context,
			{
				layout: 'auth-modal-empty'
			}
		);
	}

	return reply.redirect(redirect);
};
