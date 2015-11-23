/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function heartbeat(request, reply) {
	const memoryUsage = process.memoryUsage();

	reply('Server status is: OK')
		.header('X-Memory', String(memoryUsage.rss))
		.header('X-Uptime', String(Math.floor(process.uptime())))
		.code(200);
}
