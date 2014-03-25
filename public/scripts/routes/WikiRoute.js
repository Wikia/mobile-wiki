'use strict';
module.exports = Wikia.WikiRoute = Em.Route.extend({
	model: function (params) {
		return Em.Object.create(params);
	}
});

