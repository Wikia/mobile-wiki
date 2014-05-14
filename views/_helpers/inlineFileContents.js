var Path = require('path'),
		fs = require('fs');

module.exports = function (context) {
	return fs.readFileSync(Path.join(__dirname,  '../../.tmp/public/', context));
};
