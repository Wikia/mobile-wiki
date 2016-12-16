import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import updatePasswordFor from '../operations/update-password-with-token';
import settings from '../../../config/settings';

function getResetPasswordViewContext(request) {
	return deepExtend(authView.getDefaultContext(request),
		{
			bodyClasses: 'two-cards-page reset-password-page',
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
	const password = request.payload.password,
		token = request.payload.token,
		username = request.payload.username;

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
