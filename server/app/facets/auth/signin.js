import * as authUtils from '../../lib/auth-utils';
import settings from '../../../config/settings';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';

/**
 * @typedef {Object} SignInViewContext
 * @extends AuthViewContext
 * @property {string} headerText
 * @property {string} [headerSlogan]
 * @property {string} [forgotPasswordHref]
 * @property {string} heliosLoginURL
 * @property {string} heliosFacebookURL
 */

/**
 * @param {Hapi.Request} request
 * @param {string} redirect
 * @returns {SignInViewContext}
 */
function getSignInViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			title: 'auth:signin.signin-title',
			headerText: 'auth:signin.welcome-back',
			headerCallout: 'auth:signin.register-callout',
			headerCalloutLink: 'auth:signin.register-now',
			headerHref: authUtils.getRegisterUrl(request),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'signin-page',
			pageType: 'signin-page',
			heliosLoginURL: authUtils.getHeliosUrl('/token'),
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			submitText: 'auth:signin.submit-text',
			formId: 'loginForm',
			pageParams: {
				facebookAppId: settings.facebook.appId
			}
		}
	);
}

/**
 * @param {Hapi.Request} request
 * @param {string} redirect
 * @returns {SignInViewContext}
 */
function getFBSignInViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			title: 'auth:common.connect-with-facebook',
			headerText: 'auth:common.connect-with-facebook',
			headerCallout: 'auth:signin.register-callout',
			headerCalloutLink: 'auth:signin.register-now',
			headerHref: authUtils.getRegisterUrl(request),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'fb-connect-page',
			pageType: 'fb-connect-page',
			heliosLoginURL: authUtils.getHeliosUrl('/token'),
			heliosFacebookConnectURL: authUtils.getHeliosUrl('/users/'),
			submitText: 'auth:fb-connect.submit-text',
			formId: 'facebookConnectForm',
			headerSlogan: 'auth:fb-connect.facebook-connect-info',
			pageParams: {
				facebookAppId: settings.facebook.appId
			}
		}
	);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
function getSignInPage(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return authView.view('signin', context, request, reply);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
function getFacebookSignInPage(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getFBSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return authView.view('signin-fb', context, request, reply);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	if (request.query.method === 'facebook') {
		getFacebookSignInPage(request, reply);
	} else {
		getSignInPage(request, reply);
	}
}
