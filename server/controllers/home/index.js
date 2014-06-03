/// <reference path="../../../typings/node/node.d.ts" />
function index(request, reply) {
    reply.view('application', {
        // we could send a full article here to potentionaly speed up loading an article with a cold cache
        message: 'bar'
    });
}

module.exports = index;
