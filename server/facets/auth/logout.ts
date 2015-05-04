/// <reference path="../../../typings/hapi/hapi.d.ts" />
function logout (request: Hapi.Request, reply: any): void {
	request.auth.session.clear();
	reply.unstate('uid');
	reply.redirect('/');
}
export = logout;
