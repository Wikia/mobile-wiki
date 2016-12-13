import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import Logger from '../../lib/logger';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import resetPasswordFor from '../operations/reset-password';

function getForgotPasswordViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			bodyClasses: 'forgot-password-page',
			confirmHeaderText: 'auth:confirm-forgot-password.header',
			headerText: 'auth:forgot-password.header',
			headerCallout: 'auth:signin.register-callout',
			headerCalloutLink: 'auth:signin.register-now',
			headerHref: authUtils.getRegisterUrl(request),
			pageType: 'forgot-password-page',
			title: 'auth:forgot-password.title',
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
		context = getForgotPasswordViewContext(request, redirect);

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
	const redirect = request.payload.redirect,
		username = request.payload.username;

	Logger.error({username, redirect});

	resetPasswordFor(username, redirect)
		.then(data => {
			reply({
				payload: data.payload
			}).code(data.response.statusCode);
		})
		.catch(data => {
			reply({
				error: data.error || 'error'
			}).code(data.response.statusCode);
		});
}
