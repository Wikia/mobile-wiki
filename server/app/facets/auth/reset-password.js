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
				headerText: 'auth:reset-password.header'
			},
			secondCard: {
				headerText: 'auth:confirm-reset-password.header',
			},
			pageType: 'forgot-password-page',
			title: 'auth:reset-password.title',
			firstCardPartial() {
				return 'auth/reset-password';
			},
			secondCardPartial() {
				return 'auth/confirm-reset-password';
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
export default function get(request, reply) {
	const redirect = authView.getRedirectUrl(request),
		context = getForgotPasswordViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return assembleView(context, request, reply);
}
