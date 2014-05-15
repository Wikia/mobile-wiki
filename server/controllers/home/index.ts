/// <reference path="../../../definitions/node/node.d.ts" />

function index(request: any, reply: {view: Function}) {
	reply.view('application', {
		message: 'bar'
	});
}

export = index;
