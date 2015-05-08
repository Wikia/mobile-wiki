/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />

'use strict';
App.CategoryListItemController = Em.Controller.extend({
	cleanTitle: Em.computed('model.title', function () {
		return M.String.normalize(this.get('model.title').toString());
	})
});
