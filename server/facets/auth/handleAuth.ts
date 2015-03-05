var ttl = 2419200 * 1000; // 4 weeks

/**
 * Stores the user's authentication data, which is passed along from a login request
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 */
function storeAuthentication (request: Hapi.Request, reply: any): void {
	// If something needed for storing authentication was not sent along, redirect to log-in page
	if (!request.query.user_id || !request.query.access_token || !request.query.refresh_token) {
		return reply.redirect('/login');
	}

	request.auth.session.set({
		user_id       : request.query.user_id,
		access_token  : request.query.access_token,
		refresh_token : request.query.refresh_token
	});

	if (request.query.remember) {
		request.auth.session.ttl(ttl);
	}

	return reply.redirect(request.query.redirect ? request.query.redirect : '/');
}

export = storeAuthentication;
