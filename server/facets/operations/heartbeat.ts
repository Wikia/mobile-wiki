/// <reference path="../../../typings/hapi/hapi.d.ts" />
function heartbeat (request: Hapi.Request, reply: any): void {
	var memoryUsage = process.memoryUsage();

	reply('Server status is: OK')
		.header('X-Memory', String(memoryUsage.rss))
		.header('X-Uptime', String(~~process.uptime()))
		.code(200);
}

export = heartbeat;
