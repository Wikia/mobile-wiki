var stew = require('broccoli-stew');

module.exports = {
	name: 'no-fastboot-only',

	postprocessTree: function (type, tree) {
		if (type === 'js' || type === 'template') {
			return stew.rm(tree, '**/fastboot-only/*');
		} else {
			return tree;
		}
	}

};
