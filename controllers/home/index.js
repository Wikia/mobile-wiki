exports.index = function (request, reply) {
	reply.view('application', {
		message: 'bar'
	});
};
