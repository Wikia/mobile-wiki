var Path = require('path');
module.exports = function (context) {
	return Path.join('/components', context + '.js');
};
