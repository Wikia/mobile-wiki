import * as authUtils from '../../lib/auth-utils';
import {disableCache} from '../../lib/caching';
import settings from '../../../config/settings';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import {format} from 'url';

/**
 * @typedef {Object} JoinViewContext
 * @extends {AuthViewContext}
 * @property {string} loginRoute
 * @property {string} signupHref
 * @property {string} heliosFacebookURL
 * @property {number} [facebookAppId]
 */

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
export default function get(request, reply) {
	const context = deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:join.title',
			signinRoute: authUtils.getSignInUrl(request),
			hideHeader: true,
			signupHref: authUtils.getRegisterUrl(request),
			bodyClasses: 'splash join-page',
			pageType: 'join-page',
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			pageParams: {
				facebookAppId: settings.facebook.appId
			}
		}
	);

	let response;

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	if (authView.getViewType(request) === authView.VIEW_TYPE_DESKTOP) {
		request.url.pathname = '/register';
		response = reply.redirect(format(request.url));
		disableCache(response);
		return response;
	}

	return authView.view('join-page', context, request, reply);
}
