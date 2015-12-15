var fs = require('fs'),
	path = require('path');

// Filter out any non-.js files
function onlyScripts(name) {
	return /\.js$/i.test(path.extname(name));
}

var tasks = fs.readdirSync('./gulp/tasks').filter(onlyScripts);

tasks.forEach(function (task) {
	require('./tasks/' + task);
});
