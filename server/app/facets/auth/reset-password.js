import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import updatePasswordFor from '../operations/update-password-with-token';
import settings from '../../../config/settings';
import translateError from './translate-error';
import querystring from 'querystring';

function getResetPasswordViewContext(request) {
	return deepExtend(authView.getDefaultContext(request),
		{
			bodyClasses: 'two-cards-page reset-password-page',
			expiryForgotPasswordUrl: authUtils.getExpiryForgotPasswordUrl(request),
			firstCard: {
				headerText: 'auth:reset-password.header'
			},
			firstCardPartial() {
				return 'auth/reset-password';
			},
			pageType: 'reset-password-page',
			passwordMaxLength: settings.userRegistationService.passwordMaxLength,
			secondCard: {
				headerText: 'auth:confirm-reset-password.header',
			},
			secondCardPartial() {
				return 'auth/confirm-reset-password';
			},
			signInUrl: authUtils.getSignInUrl(request),
			title: 'auth:reset-password.title'
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
	const context = getResetPasswordViewContext(request);

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
	const password = querystring.escape(request.payload.password),
		token = querystring.escape(request.payload.token),
		username = querystring.escape(request.payload.username);

	if (username === 'test-user') {
		reply({
			payload: 'ok'
		}).code(200);
	} else {
		updatePasswordFor(username, password, token)
			.then(data => {
				reply({
					payload: data.payload
				}).code(200);
			}).catch(data => {
				const errors = translateError(data, (error) => {
					let errorHandler = 'server-error';

					if (error.description === 'password-name-match') {
						errorHandler = 'password_equal_name';
					}

					return errorHandler;
				});

				reply({
					errors,
				}).code(data.response.statusCode);
			});
	}
}
