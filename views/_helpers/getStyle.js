'use strict';
var Path = require('path');
module.exports = function(context) {
	return Path.join('/public', 'styles', context + '.css');
};
