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

class AuthLogger {
	static instance: AuthLogger;
	isEnabled: boolean = false;
	url: string;
	static levels: any = {
		emergency: 'emergency',
		critical: 'critical',
		alert: 'alert',
		error: 'error',
		warning: 'warning',
		notice: 'notice',
		info: 'info',
		debug: 'debug'
	};

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
			level: AuthLogger.levels.error,
			status: xhr.status,
			response: xhr.responseText,
			//Might give undefined in ie11
			heliosUrl: xhr.responseUrl,
			clientUrl: window.location.href
		});
	}
}
