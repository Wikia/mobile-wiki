/// <reference path='../../typings/node/node.d.ts' />

/**
 * @description Helper methods for the Auth Flow
 */

import url = require('url');

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

export function getCacheBustedUrl(url: string): string {
	var cacheBustedUrlObj = url.parse(redirect),
	cachebuster = Math.floor(Math.random() * 10000);

	if (cacheBustedUrlObj.search) {
		cacheBustedUrlObj.search += '&cb=';
	} else {
		cacheBustedUrlObj.search = 'cb=';
	}

	cacheBustedUrlObj.search += cachebuster;
	return url.format(cacheBustedUrlObj);
}
