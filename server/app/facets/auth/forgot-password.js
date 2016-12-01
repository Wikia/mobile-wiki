import * as authUtils from '../../lib/auth-utils';
import settings from '../../../config/settings';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import Logger from '../../lib/logger';

function getSignInViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			title: 'auth:forgot-password.title',
			headerText: 'auth:forgot-password.header',
			headerCallout: 'auth:signin.register-callout',
			headerCalloutLink: 'auth:signin.register-now',
			headerHref: authUtils.getRegisterUrl(request),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'forgot-password-page',
			pageType: 'signin-page',
			heliosLoginURL: authUtils.getHeliosUrl('/token'),
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			submitText: 'auth:forgot-password.submit-text',
			formId: 'loginForm',
			pageParams: {
				facebookAppId: settings.facebook.appId
			}
		}
	);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 */
export default function get(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return authView.view('forgot-password', context, request, reply);
}
