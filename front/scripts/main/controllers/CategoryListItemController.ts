/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />

'use strict';
App.CategoryListItemController = Em.Controller.extend({
	cleanTitle: function () {
		return M.String.normalize(this.get('model.title').toString());
	}.property('model.title')
});
