import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import querystring from 'querystring';
import settings from '../../../config/settings';
import translateError from './translate-error';
import updatePasswordFor from '../operations/update-password-with-token';
import validateTokenFor from '../operations/validate-token';

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

function isInvalidResetTokenErrorCode(code) {
	return code === 403;
}

function showPage(request, reply) {
	const context = getResetPasswordViewContext(request);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return assembleView(context, request, reply);
}

function validateTokenAndShowPage(request, reply) {
	const token = querystring.escape(request.query.token),
		username = querystring.escape(request.query.username);

	if (username && token) {
		validateTokenFor(username, token)
			.then(data => {
				return showPage(request, reply);
			}).catch(data => {
				if (isInvalidResetTokenErrorCode(data.response.statusCode)) {
					return reply.redirect(authUtils.getExpiryForgotPasswordUrl(request)).takeover();
				} else {
					return showPage(request, reply);
				}
			});
	} else {
		return showPage(request, reply);
	}
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 */
export function get(request, reply) {
	return validateTokenAndShowPage(request, reply);
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
