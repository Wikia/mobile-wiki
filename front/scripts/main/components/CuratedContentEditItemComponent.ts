/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditItemComponent = Em.Component.extend({
	classNames: ['curated-content-edit-item'],

	willInsertElement: function() {
		this.set('item', this.get('model').item);
	}

});
