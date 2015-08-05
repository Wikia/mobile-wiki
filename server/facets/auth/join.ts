/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface JoinViewContext extends authView.AuthViewContext {
	loginRoute: string;
	signupHref: string;
	heliosFacebookURL: string;
	facebookAppId?: number;
}

function get (request: Hapi.Request, reply: any): Hapi.Response {
	var context: JoinViewContext,
		redirectUrl: string = authView.getRedirectUrl(request);

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	if (authView.getViewType(request) === authView.VIEW_TYPE_DESKTOP) {
		return reply.redirect('/register');
	}

	context = deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:join.title',
			signinRoute: authUtils.getSignInUrl(request),
			hideHeader: true,
			hideFooter: true,
			signupHref: authUtils.getRegisterUrl(request),
			bodyClasses: 'splash join-page',
			heliosFacebookURL: localSettings.helios.host + '/facebook/token',
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
		}
	);

	return authView.view('join-page', context, request, reply);
}

export = get;
