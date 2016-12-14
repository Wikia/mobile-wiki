import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import resetPasswordFor from '../operations/reset-password';
import settings from '../../../config/settings';

function getResetPasswordViewContext(request, redirect) {
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
			passwordMaxLength: settings.helios.passwordMaxLength,
			secondCard: {
				headerText: 'auth:confirm-reset-password.header',
			},
			secondCardPartial() {
				return 'auth/confirm-reset-password';
			},
			title: 'auth:reset-password.title',
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
export default function get(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getResetPasswordViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return assembleView(context, request, reply);
}
