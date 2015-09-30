/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

import url = require('url');

interface JoinViewContext extends authView.AuthViewContext {
	loginRoute: string;
	signupHref: string;
	heliosFacebookURL: string;
	facebookAppId?: number;
}

function get (request: Hapi.Request, reply: any): Hapi.Response {
	var context: JoinViewContext,
		response: Hapi.Response;

	context = deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:join.title',
			signinRoute: authUtils.getSignInUrl(request),
			hideHeader: true,
			hideFooter: true,
			signupHref: authUtils.getRegisterUrl(request),
			bodyClasses: 'splash join-page',
			pageType: 'join-page',
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
		}
	);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	if (authView.getViewType(request) === authView.VIEW_TYPE_DESKTOP) {
		request.url.pathname = '/register';
		response = reply.redirect(url.format(request.url));
		caching.disableCache(response);
		return response;
	}

	return authView.view('join-page', context, request, reply);
}

export = get;
