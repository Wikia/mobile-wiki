(function () {
	/**
	 * Normally we would use $.cookie
	 * but this is loaded in head and we don't have jQuery there yet
	 *
	 * @param {String} name
	 * @returns {String}
	 */
	function getCookie(name) {
		var value = "; " + document.cookie,
			parts = value.split("; " + name + "=");

		if (parts.length == 2) {
			return decodeURIComponent(parts.pop().split(";").shift());
		}
	}

	var geoCookie = getCookie('Geo');

	if (geoCookie) {
		M.prop('geo', JSON.parse(geoCookie));
	} else if (M.prop('environment') === 'dev') {
		M.prop('geo', {
			country: 'wikia-dev-country',
			continent: 'wikia-dev-continent'
		});
	} else {
		console.debug('Geo cookie is not set');
	}
})();
