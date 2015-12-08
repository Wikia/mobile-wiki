let cachedData = {};

export function loadGlobalData() {
	new RSVP.Promise((resolve)  => {
		$.get('/globals', (data) => {
			resolve(data);
		}).then((data) => {
			cachedData = data;
		});
	});
}

export function getLoginUrl() {
	return cachedData ? cachedData.loginUrl : null;
}
