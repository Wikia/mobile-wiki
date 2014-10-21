/// <reference path="../app.ts" />
/// <reference path="../../wikia/utils/string.ts" />

'use strict';
App.CategoryListItemController = Em.ObjectController.extend({
	cleanTitle: function () {
		return M.String.normalize(this.get('title').toString());
	}.property('title')
});
