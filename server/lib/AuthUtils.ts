/// <reference path='../../typings/node/node.d.ts' />
/**
 * @description Helper methods for the Auth Flow
 */

import url = require('url');
import querystring = require('querystring');

var wikiaSignupPathname: string = '/wiki/Special:UserSignup',
	wikiaLoginPathname: string = '/wiki/Special:UserLogin',
	forgotPasswordSearch: string = '?recover=1';

export function getRegisterUrl(request: Hapi.Request): string {
	return this.getRedirectUrlWithQueryString('register', request);
}

export function getForgotPasswordUrlFromRedirect(redirect: string): string {
	var forgotPasswordUrlObj = url.parse(redirect);
	forgotPasswordUrlObj.pathname = wikiaLoginPathname;
	forgotPasswordUrlObj.search = forgotPasswordSearch;
	return url.format(forgotPasswordUrlObj);
}

export function getLoginUrl(request: Hapi.Request): string {
	return this.getRedirectUrlWithQueryString('login', request);
}

export function getCacheBusterUrl(redirect: string): string {
	var cacheBustedUrlObj = url.parse(redirect),
		query = querystring.parse(cacheBustedUrlObj.query);

	query.cb = Math.floor(Math.random() * 10000);
	cacheBustedUrlObj.search = querystring.stringify(query);

	return url.format(cacheBustedUrlObj);
}

export function getRedirectUrlWithQueryString(route: string, request: Hapi.Request) {
	var redirectUrl = request.url;
	redirectUrl.pathname = route;
	return redirectUrl.format();
}
