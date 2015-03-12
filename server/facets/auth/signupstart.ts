/// <reference path='../../../typings/hapi/hapi.d.ts' />

function get (request: Hapi.Request, reply: any): void {
	if (request.auth.isAuthenticated) {
		return reply.redirect(request.query.redirect || '/');
	}

	return reply.view('login', null, {
		layout: 'wikia-static'
	});
}

export = get;
