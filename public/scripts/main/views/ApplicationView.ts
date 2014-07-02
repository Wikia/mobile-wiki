/// <reference path="../app.ts" />

'use strict';

App.ApplicationView = Em.View.extend({
	willInsertElement() {
		$('#app-container').html('');
	}
});