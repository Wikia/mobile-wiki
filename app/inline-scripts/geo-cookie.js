(function () {
	var geoCookie,
		cookieValue = '; ' + document.cookie,
		cookieParts = cookieValue.split('; Geo=');

	// Normally we would use $.cookie but jQuery isn't loaded yet
	if (cookieParts.length === 2) {
		geoCookie = decodeURIComponent(cookieParts.pop().split(';').shift());
	}

	if (geoCookie) {
		M.geo = JSON.parse(geoCookie);
	} else if (M.getFromShoebox('runtimeConfig.wikiaEnv') === 'dev') {
		M.geo = {
			country: 'wikia-dev-country',
			continent: 'wikia-dev-continent'
		};
	} else {
		console.debug('Geo cookie is not set');
	}
})();
