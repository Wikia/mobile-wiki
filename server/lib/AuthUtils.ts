/// <reference path='../../typings/node/node.d.ts' />
/// <reference path='../../typings/hapi/hapi.d.ts' />
/**
 * @description Helper methods for the Auth Flow
 */

import url = require('url');
import querystring = require('querystring');

var wikiaSignupPathname: string = '/Special:UserSignup',
	wikiaLoginPathname: string = '/Special:UserLogin',
	forgotPasswordSearch: string = '?recover=1';

export function getSignupUrlFromRedirect(redirect: string): string {
	var signupUrlObj = url.parse(redirect);
	signupUrlObj.pathname = wikiaSignupPathname;
	return url.format(signupUrlObj);
}

export function getForgotPasswordUrlFromRedirect(redirect: string): string {
	var forgotPasswordUrlObj = url.parse(redirect);
	forgotPasswordUrlObj.pathname = wikiaLoginPathname;
	forgotPasswordUrlObj.search = forgotPasswordSearch;
	return url.format(forgotPasswordUrlObj);
}

export function getLoginUrlFromRedirect(redirect: string): string {
	var forgotPasswordUrlObj = url.parse(redirect);
	forgotPasswordUrlObj.pathname = wikiaLoginPathname;
	return url.format(forgotPasswordUrlObj);
}

export function getCacheBusterUrl(redirect: string): string {
	var cacheBustedUrlObj = url.parse(redirect),
		query = querystring.parse(cacheBustedUrlObj.query);

	query.cb = Math.floor(Math.random() * 10000);
	cacheBustedUrlObj.search = querystring.stringify(query);

	return url.format(cacheBustedUrlObj);
}

export function disableCache (response: Hapi.Response): void {
	response.header('Cache-Control', 'private, s-maxage=0, max-age=0, must-revalidate');
}
