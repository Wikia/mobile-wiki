/// <reference path="../../../definitions/node/node.d.ts" />

function index(request: any, reply: {view: Function}) {
	reply.view('application', {
		message: 'bar'// we could send a full article here to potentionaly speed up loading an article with a cold cache
	});
}

export = index;
