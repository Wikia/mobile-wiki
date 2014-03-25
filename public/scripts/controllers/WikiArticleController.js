'use strict';
Wikia.WikiArticleController = Em.ArrayController.extend({
	actions: {
		test: function () {
			console.log(this);
		}
	}
});
module.exports = Wikia.WikiArticleController;
