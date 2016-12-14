import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import resetPasswordFor from '../operations/reset-password';

function getForgotPasswordViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			bodyClasses: 'forgot-password-page',
			firstCard: {
				headerCallout: 'auth:signin.register-callout',
				headerCalloutLink: 'auth:signin.register-now',
				headerHref: authUtils.getRegisterUrl(request),
				headerText: 'auth:forgot-password.header'
			},
			secondCard: {
				headerText: 'auth:confirm-forgot-password.header',
			},
			pageType: 'forgot-password-page',
			title: 'auth:forgot-password.title',
			firstCardPartial() {
				return 'auth/forgot-password';
			},
			secondCardPartial() {
				return 'auth/forgot-password-check-email';
			}
		}
	);
}

function assembleView(context, request, reply) {
	const response = reply.view(
		`auth/${authView.getViewType(request)}/cards`,
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

	return assembleView(context, request, reply);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 */
export function post(request, reply) {
	const redirect = request.payload.redirect,
		username = request.payload.username;

	if (username === 'test-user') {
		reply({
			payload: 'ok'
		}).code(200);
	} else {
		resetPasswordFor(username, redirect)
			.then(data => {
				reply({
					payload: data.payload
				}).code(200);
			}).catch(data => {
				reply({
					error: data.error || 'error',
					step: data.step
				}).code(data.response.statusCode);
			});
	}
}
