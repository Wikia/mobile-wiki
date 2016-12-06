import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import settings from '../../../config/settings';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import Logger from '../../lib/logger';

function getSignInViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			title: 'auth:forgot-password.title',
			forgotPasswordURL: '/forgotpassword',
			headerText: 'auth:forgot-password.header',
			headerCallout: 'auth:signin.register-callout',
			headerCalloutLink: 'auth:signin.register-now',
			headerHref: authUtils.getRegisterUrl(request),
			bodyClasses: 'forgot-password-page',
			pageType: 'forgot-password-page',
			submitText: 'auth:forgot-password.submit-text',
			formId: 'forgotPasswordForm',
			pageParams: {
				facebookAppId: settings.facebook.appId
			}
		}
	);
}

function assembleView(template, context, request, reply) {
	const response = reply.view(
		`auth/${authView.getViewType(request)}/${template}`,
		context,
		{
			layout: 'card'
		}
	);

	disableCache(response);
	return response;
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 */
export function get(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getSignInViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return assembleView('forgot-password', context, request, reply);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 */
export function post(request, reply) {
	return reply.success();
}
