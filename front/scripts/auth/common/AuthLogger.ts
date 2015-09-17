interface LoggerData {
	severity: string;
	url: string;
	data: any;
}

interface ClickStreamPayload {
	events: LoggerData[];
}

interface PageParams {
	enableAuthLogger: boolean;
}

class AuthLogger {
	static baseUrl: string = 'https://services.wikia.com/clickstream/events/social';
	static isEnabled = window.pageParams ? window.pageParams.enableAuthLogger : false;

	static log(data: any, severity: string): void {
		if (AuthLogger.isEnabled) {
			var loggerXhr = new XMLHttpRequest(),
				clickStreamPayload = AuthLogger.getClickstreamPayload(data, severity);
			loggerXhr.open('POST', AuthLogger.baseUrl, true);
			loggerXhr.withCredentials = true;
			loggerXhr.setRequestHeader('Content-Type', 'application/json');
			loggerXhr.send(
				JSON.stringify(clickStreamPayload)
			);
		}
	}

	static getClickStreamPayload(data: any, severity: string): ClickStreamPayload {
		var events: LoggerData[];

		if (typeof data === 'array') {
			events = data;
		} else {
			events.push(data);
		}

		return {
			events: events
		};
	}

	static error(data: any): void {
		AuthLogger.log(data, 'error');
	}
}
