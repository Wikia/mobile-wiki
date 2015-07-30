/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />

'use strict';
App.CategoryListItemController = Em.Controller.extend({
	cleanTitle: Em.computed('model.title', function () {
		return M.String.normalizeToWhitespace(this.get('model.title').toString());
	})
});
