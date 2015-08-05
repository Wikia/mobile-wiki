'use strict';

App.CuratedContentEditorImageRoute = Em.Route.extend({

	serialize(model): any {
		return {
			item: model.item
		};
	},
});
