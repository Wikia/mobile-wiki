var fs = require('fs'),
	path = require('path');
	es = require('event-stream');

function getFolders(dir){
	return fs.readdirSync(dir)
		.filter(function(file){
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

module.exports = function folders(dir, tasks){
	return function(){
		var folders = getFolders(dir),
			streams = folders.map(tasks);

		return es.concat.apply(null, streams);
	};
};
