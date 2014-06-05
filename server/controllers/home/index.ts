/// <reference path="../../../typings/node/node.d.ts" />

function index(request: any, reply: { view: Function }) {
	reply.view('application', {
		// we could send a full article here to potentionaly speed up loading an article with a cold cache
		message: 'bar'
	});
}

export = index;
