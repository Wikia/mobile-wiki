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
	authLoggerUrl: string;
}

class AuthLogger {
	static instance: AuthLogger;
	isEnabled: boolean = false;
	url: string;

	constructor () {
		if (window.pageParams) {
			this.isEnabled = window.pageParams.enableAuthLogger;
			this.url = window.pageParams.authLoggerUrl;
		}
	}

	static getInstance(): AuthLogger {
		if (!AuthLogger.instance) {
			AuthLogger.instance = new AuthLogger();
		}
		return AuthLogger.instance;
	}

	private log(data: any, severity: string): void {
		if (this.isEnabled) {
			var loggerXhr = new XMLHttpRequest(),
				clickStreamPayload = this.getClickStreamPayload(data, severity);
			loggerXhr.open('POST', this.url, true);
			loggerXhr.withCredentials = true;
			loggerXhr.setRequestHeader('Content-Type', 'application/json');
			loggerXhr.send(
				JSON.stringify(clickStreamPayload)
			);
		}
	}

	private getClickStreamPayload(data: any, severity: string): ClickStreamPayload {
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

	public error(data: any): void {
		this.log(data, 'error');
	}
}
