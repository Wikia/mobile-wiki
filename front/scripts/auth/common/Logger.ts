class Logger {
	baseUrl: 'https://services.wikia.com/clickstream/events/social';

	public log(event: Event): void {
		var loggerXhr = new XMLHttpRequest(),
			data: {};

		loggerXhr.open('POST', this.baseUrl, true);
		loggerXhr.withCredentials = true;
		loggerXhr.setRequestHeader('Content-type', 'application/json');
		loggerXhr.send(data);
	}
}
