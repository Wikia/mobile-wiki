/// <reference path='../../../typings/hapi/hapi.d.ts' />

import caching = require('../../lib/Caching');
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
		noScripts?: boolean;
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
		var redirectUrl: string = request.query.redirect || '/',
			redirectUrlHost: string = url.parse(redirectUrl).host,
			whiteListedDomains: Array<string> = ['wikia.com'],
			isWhiteListedDomain: boolean;

		if (!redirectUrlHost) {
			return redirectUrl;
		}

		if (redirectUrlHost.indexOf(request.headers.host) !== -1) {
			return redirectUrl;
		}

		isWhiteListedDomain = whiteListedDomains.some((whiteListedDomain: string): boolean => {
			return redirectUrlHost.indexOf(whiteListedDomain) !== -1;
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
			title: undefined,
			canonicalUrl: this.getCanonicalUrl(request),
			exitTo: this.getRedirectUrl(request),
			language: request.server.methods.i18n.getInstance().lng()
		};
	}
}

export = authView;
