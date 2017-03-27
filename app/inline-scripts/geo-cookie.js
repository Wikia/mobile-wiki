(function () {
	// Normally we would use $.cookie but jQuery isn't loaded yet
	function getCookie(name) {
		var value = '; ' + document.cookie,
			parts = value.split('; ' + name + '=');

		if (parts.length === 2) {
			return decodeURIComponent(parts.pop().split(';').shift());
		}
	}

	var geoCookie = getCookie('Geo');

	if (geoCookie) {
		M.geo = JSON.parse(geoCookie);
	} else if (M.getFromShoebox('runtimeConfig.environment') === 'dev') {
		M.geo = {
			country: 'wikia-dev-country',
			continent: 'wikia-dev-continent'
		};
	} else {
		console.debug('Geo cookie is not set');
	}
})();
