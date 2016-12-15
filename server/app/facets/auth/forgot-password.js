import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import resetPasswordFor from '../operations/reset-password';
import settings from '../../../config/settings';
import querystring from 'querystring';

function getForgotPasswordViewContext(request, redirect) {
	return deepExtend(authView.getDefaultContext(request),
		{
			bodyClasses: 'two-cards-page forgot-password-page',
			firstCard: {
				headerCallout: 'auth:signin.register-callout',
				headerCalloutLink: 'auth:signin.register-now',
				headerHref: authUtils.getRegisterUrl(request),
				headerText: 'auth:forgot-password.header'
			},
			firstCardPartial() {
				return 'auth/forgot-password';
			},
			pageType: 'forgot-password-page',
			secondCard: {
				headerText: 'auth:confirm-forgot-password.header',
			},
			secondCardPartial() {
				return 'auth/forgot-password-check-email';
			},
			title: 'auth:forgot-password.title',
			usernameMaxLength: settings.userRegistationService.usernameMaxLength
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
		username = querystring.escape(request.payload.username);

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
				const generalError = {
						title: 'string',
						errors: [{
							description: 'error',
							additional: {}}]},
					payload = data.payload
						? JSON.parse(data.payload)
						: generalError;

				reply({
					errors: payload,
					step: data.step
				}).code(data.response.statusCode);
			});
	}
}
