/// <reference path='../../../typings/hapi/hapi.d.ts' />

import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');
import url = require('url');

module authView {
	export interface AuthViewContext {
		title: string;
		canonicalUrl: string;
		language: string;
		exitTo: string;
		hideHeader?: boolean;
		hideFooter?: boolean;
		footerHref?: string;
		footerCallout?: string;
		footerCalloutLink?: string;
		headerText?: string;
		bodyClasses?: string;
		trackingConfig?: any;
	}

	export function view (template: string, context: AuthViewContext, request: Hapi.Request, reply: any): Hapi.Response {
		var response: Hapi.Response;

		response = reply.view(
			template,
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
			redirectUrlHost: string = url.parse(redirectUrl).host,
			whiteListedDomains: Array<string> = ['.wikia.com'],
			isWhiteListedDomain: boolean;

		if (!redirectUrlHost) {
			return redirectUrl;
		}

		if (
			currentHost === redirectUrlHost ||
			redirectUrlHost.indexOf('.' + currentHost, redirectUrlHost.length - currentHost.length - 1) !== -1
		) {
			return redirectUrl;
		}

		isWhiteListedDomain = whiteListedDomains.some((whiteListedDomain: string): boolean => {
			return redirectUrlHost.indexOf(whiteListedDomain, redirectUrlHost.length - whiteListedDomain.length) !== -1;
		});

		if (isWhiteListedDomain) {
			return redirectUrl;
		}

		// Not valid domain
		return '/';
	}

	export function getCanonicalUrl (request: Hapi.Request): string {
		return 'https://' + request.headers.host + request.path;
	}

	export function getDefaultContext (request: Hapi.Request): AuthViewContext {
		return {
			title: null,
			canonicalUrl: this.getCanonicalUrl(request),
			exitTo: this.getRedirectUrl(request),
			language: request.server.methods.i18n.getInstance().lng(),
			trackingConfig: localSettings.tracking
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
}

export = authView;
