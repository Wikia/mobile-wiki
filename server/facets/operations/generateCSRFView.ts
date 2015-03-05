/// <reference path='../../../typings/hapi/hapi.d.ts' />
function generateCSRFView (request: Hapi.Request, reply: any): void {
	reply.view('breadcrumb', null, {layout: 'empty'});
}

export = generateCSRFView;
