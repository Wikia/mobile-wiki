/// <reference path='../../../typings/hapi/hapi.d.ts' />

function redirectToRoot (request: Hapi.Request, reply: any) {
	return reply.redirect('/');
}

export = redirectToRoot;
