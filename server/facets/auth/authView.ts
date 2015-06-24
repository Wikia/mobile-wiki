/// <reference path='../../../typings/hapi/hapi.d.ts' />

import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');

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
		return request.query.redirect || '/';
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
}

export = authView;
