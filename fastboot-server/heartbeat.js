module.exports = function (req, res) {
	res
		.set('X-Memory', String(process.memoryUsage().rss))
		.set('X-Uptime', String(Math.floor(process.uptime())))
		.status(200)
		.send('Server status is: OK');
};
