var Path = require('path'),
	manifest;

module.exports = function (context, file) {
	try {
		manifest = require('../../public/' + context + '/rev-manifest.json');
	} catch (ex) {}

	return Path.join('/' + context, manifest ? manifest[file] : file);
};
