interface XhrLoggerData {
	level: string;
	status: number;
	response: any;
	heliosUrl: string;
	clientUrl: string;
}

interface ClickStreamPayload {
	events: any[];
}

interface PageParams {
	enableAuthLogger: boolean;
	authLoggerUrl: string;
}

interface XMLHttpRequest {
	responseUrl: string;
}

enum AuthLoggerLevels {
	Emergency,
	critical,
	alert,
	error,
	warning,
	notice,
	info,
	debug
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
			var loggerXhr: XMLHttpRequest = new XMLHttpRequest(),
				clickStreamPayload: ClickStreamPayload = this.getClickStreamPayload(data);
			loggerXhr.open('POST', this.url, true);
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
			level: AuthLoggerLevels.error,
			status: xhr.status,
			response: xhr.responseText,
			//Might give undefined in ie11
			heliosUrl: xhr.responseUrl,
			clientUrl: window.location.href
		});
	}
}
