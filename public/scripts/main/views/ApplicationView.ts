/// <reference path="../app.ts" />
/// <reference path="../utils/sloth.ts" />
/// <reference path="../utils/lazyload.ts" />
'use strict';
App.ApplicationView = Em.View.extend({
	willInsertElement() {
		$('#app-container').html('');
	}
});
