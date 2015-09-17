interface LoggerData {
	severity: string;
	url: string;
	data: any;
}

class Logger {
	baseUrl: 'https://services.wikia.com/clickstream/events/social';

	private log(data: any, severity: string): void {
		var loggerXhr = new XMLHttpRequest(),
			loggerData = this.getLoggerData(data, severity);
		loggerXhr.open('POST', this.baseUrl, true);
		loggerXhr.withCredentials = true;
		loggerXhr.setRequestHeader('Content-type', 'application/json');
		loggerXhr.send(loggerData);
	}

	private getLoggerData(data: any, severity: string): LoggerData {
		return {
			severity: severity,
			url: window.location.href,
			data: data
		}
	}

	public error(data: any): void {
		this.log(data, 'error');
	}
}
