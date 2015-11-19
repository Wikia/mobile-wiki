/// <reference path='../../../typings/hapi/hapi.d.ts' />

function redirectToRoot (request: Hapi.Request, reply: any): void {
	reply.redirect('/');
}

export = redirectToRoot;
