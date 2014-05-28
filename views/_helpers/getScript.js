var Path = require('path');

module.exports = function (context) {
	return Path.join('/scripts', context + '.js');
};
