/// <reference path='../../../typings/hapi/hapi.d.ts' />

import caching = require('../../lib/Caching');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import url = require('url');

module authView {
	interface PageParams {
		[key: string]: string;
	}

	export var VIEW_TYPE_MOBILE = 'mobile';
	export var VIEW_TYPE_DESKTOP = 'desktop';

	export interface AuthViewContext {
		title: string;
		canonicalUrl: string;
		language: string;
		exitTo: string;
		mainPage: string;
		optimizelyScript: string;
		pageParams: any;
		hideHeader?: boolean;
		hideFooter?: boolean;
		footerHref?: string;
		footerCallout?: string;
		footerCalloutLink?: string;
		headerText?: string;
		bodyClasses?: string;
		pageType?: string;
		parentOrigin?: string;
		standalone?: boolean;
		trackingConfig?: any;
	}

	export function view (template: string, context: AuthViewContext, request: Hapi.Request, reply: any): Hapi.Response {
		var response: Hapi.Response;

		response = reply.view(
			'auth/' + this.getViewType(request) + '/' + template,
			context,
			{
				layout: 'auth'
			}
		);

		caching.disableCache(response);
		return response;
	}

	export function getRedirectUrl (request: Hapi.Request): string {
		var currentHost: string = request.headers.host,
			redirectUrl: string = request.query.redirect || '/',
			redirectUrlHost: string = url.parse(redirectUrl).host;

		if (!redirectUrlHost ||
			this.checkDomainMatchesCurrentHost(redirectUrlHost, currentHost) ||
			this.isWhiteListedDomain(redirectUrlHost)
		) {
			return redirectUrl;
		}

		// Not valid domain
		return '/';
	}

	export function getOrigin (request: Hapi.Request): string {
		var currentHost: string = request.headers.host,
			redirectUrl: string = request.query.redirect || '/',
			redirectUrlHost: string = url.parse(redirectUrl).host,
			redirectUrlOrigin: string = url.parse(redirectUrl).protocol + '//' + redirectUrlHost;

		if (redirectUrlHost && (
				this.checkDomainMatchesCurrentHost(redirectUrlHost, currentHost) ||
				this.isWhiteListedDomain(redirectUrlHost)
			)
		) {
			return redirectUrlOrigin;
		}

		return this.getCurrentOrigin(request);
	}

	export function checkDomainMatchesCurrentHost (domain: string, currentHost: string): boolean {
		return currentHost === domain ||
			domain.indexOf('.' + currentHost, domain.length - currentHost.length - 1) !== -1;
	}

	export function isWhiteListedDomain (domain: string): boolean {
		var whiteListedDomains: Array<string> = ['.wikia.com', '.wikia-dev.com'];

		return whiteListedDomains.some((whiteListedDomain: string): boolean => {
			return domain.indexOf(whiteListedDomain, domain.length - whiteListedDomain.length) !== -1;
		});
	}

	export function getCurrentOrigin (request: Hapi.Request): string {
		// for now the assumption is that there will be https
		return 'https://' + request.headers.host;
	}

	export function getCanonicalUrl (request: Hapi.Request): string {
		return this.getCurrentOrigin(request) + request.path;
	}

	export function getDefaultContext (request: Hapi.Request): AuthViewContext {
		var viewType: string = this.getViewType(request),
			isModal: boolean = request.query.modal === '1';
		return {
			title: null,
			canonicalUrl: this.getCanonicalUrl(request),
			exitTo: this.getRedirectUrl(request),
			mainPage: 'http://www.wikia.com',
			language: request.server.methods.i18n.getInstance().lng(),
			trackingConfig: localSettings.tracking,
			optimizelyScript: localSettings.optimizely.scriptPath +
				localSettings.optimizely.account + '.js',
			standalonePage: (viewType === authView.VIEW_TYPE_DESKTOP && !isModal),
			pageParams: {
				cookieDomain: localSettings.authCookieDomain,
				isModal: isModal,
				viewType: viewType,
				parentOrigin: (isModal ? authView.getOrigin(request) : undefined),
				enableAuthLogger: localSettings.enableAuthLogger
			}
		};
	}

	export function validateRedirect (request: Hapi.Request, reply: any): any {
		var queryRedirectUrl = authView.getRedirectUrl(request);

		if (request.query.redirect && queryRedirectUrl !== request.query.redirect) {
			request.url.query.redirect = queryRedirectUrl;
			request.url.search = null;
			return reply.redirect(request.url.format()).takeover();
		}

		return reply();
	}

	export function getViewType (request: Hapi.Request): string {
		var mobilePattern = localSettings.patterns.mobile,
			ipadPattern = localSettings.patterns.iPad;
		if (mobilePattern.test(request.headers['user-agent']) && !ipadPattern.test(request.headers['user-agent'])) {
			return this.VIEW_TYPE_MOBILE;
		}
		return this.VIEW_TYPE_DESKTOP;
	}

	export function onAuthenticatedRequestReply (request: Hapi.Request, reply: any,
												 context: AuthViewContext): Hapi.Response {

		var redirect: string = authView.getRedirectUrl(request),
			response: Hapi.Response;

		if (context.pageParams.isModal) {

			response = reply.view(
				'auth/desktop/modal-message',
				context,
				{
					layout: 'auth-modal-empty'
				}
			);
		} else {
			response = reply.redirect(redirect);
		}

		return response;
	}
}

export = authView;
