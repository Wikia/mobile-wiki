/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');


interface SignInViewContext extends authView.AuthViewContext {
	headerText: string;
	headerSlogan?: string;
	forgotPasswordHref?: string;
	heliosLoginURL: string;
	heliosFacebookURL: string;
}

function getSignInViewContext (request: Hapi.Request, redirect: string): SignInViewContext {
	return deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:signin.signin-title',
			headerText: 'auth:signin.welcome-back',
			footerCallout: 'auth:signin.register-callout',
			footerCalloutLink: 'auth:signin.register-now',
			footerHref: authUtils.getRegisterUrl(request),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'signin-page',
			pageType: 'signin-page',
			heliosLoginURL: authUtils.getHeliosUrl('/token'),
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			submitText: 'auth:signin.submit-text',
			formId: 'loginForm',
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
		}
	);
}

function getFBSignInViewContext (request: Hapi.Request, redirect: string): SignInViewContext {
	return deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:common.connect-with-facebook',
			headerText: 'auth:common.connect-with-facebook',
			footerCallout: 'auth:signin.register-callout',
			footerCalloutLink: 'auth:signin.register-now',
			footerHref: authUtils.getRegisterUrl(request),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'fb-connect-page',
			pageType: 'fb-connect-page',
			heliosLoginURL: authUtils.getHeliosUrl('/token'),
			heliosFacebookConnectURL: authUtils.getHeliosUrl('/users/'),
			submitText: 'auth:fb-connect.submit-text',
			formId: 'facebookConnectForm',
			headerSlogan: 'auth:fb-connect.facebook-connect-info',
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
		}
	);
}

function getSignInPage (request: Hapi.Request, reply: any) : Hapi.Response {
	var redirect: string = authView.getRedirectUrl(request),
		context: SignInViewContext = getSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.requestAuthenticated(request, reply, context);
	}

	return authView.view('signin', context, request, reply);
}

function getFacebookSignInPage (request: Hapi.Request, reply: any) : Hapi.Response {
	var redirect: string = authView.getRedirectUrl(request),
		context: SignInViewContext = getFBSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.requestAuthenticated(request, reply, context);
	}

	return authView.view('signin-fb', context, request, reply);
}

export function get (request: Hapi.Request, reply: any): void {
	if (request.query.method === 'facebook') {
		getFacebookSignInPage(request, reply);
	} else {
		getSignInPage(request, reply);
	}
}
