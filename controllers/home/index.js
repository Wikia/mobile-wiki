exports.index = function (request, reply) {
	reply.view('home/index', {
		title: 'foo',
		message: 'bar'
	});
};
