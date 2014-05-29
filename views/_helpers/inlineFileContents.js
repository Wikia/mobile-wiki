var Path = require('path'),
	fs = require('fs');

module.exports = function (context) {
	var file =  context.fn ? context.fn() : context;

	return fs.readFileSync(Path.join(__dirname,  '../../public/', file));
};
