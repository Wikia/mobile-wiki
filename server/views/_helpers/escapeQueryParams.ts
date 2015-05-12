import Hoek = require('hoek');
function decodeQueryParams (query) {
	var keys = Object.keys(query),
		obj = {};

	keys.forEach((key) => {
		obj[Hoek.escapeHtml(key)] = Hoek.escapeHtml(query[key].toString());
	});

	console.log(obj);

	return obj;
}
export = decodeQueryParams;
