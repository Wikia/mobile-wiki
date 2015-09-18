interface XhrLoggerData {
	status: number;
	response: any;
}

interface ClickStreamPayload {
	events: any[];
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

	public log(data: any): void {
		if (this.isEnabled) {
			var loggerXhr = new XMLHttpRequest(),
				clickStreamPayload = this.getClickStreamPayload(data);
			loggerXhr.open('POST', this.url, true);
			loggerXhr.withCredentials = true;
			loggerXhr.setRequestHeader('Content-Type', 'application/json');
			loggerXhr.send(
				JSON.stringify(clickStreamPayload)
			);
		}
	}

	private getClickStreamPayload(data: any): ClickStreamPayload {
		var events: any[] = [];

		if (typeof data === 'array') {
			events = data;
		} else {
			events.push(data);
		}

		return {
			events: events
		};
	}

	public xhrError(xhr: XMLHttpRequest): void {
		this.log({
			status: xhr.status,
			response: xhr.responseText
		});
	}
}
