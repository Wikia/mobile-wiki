/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.LightboxController = Em.Controller.extend(App.LoadingSpinnerMixin, {
	header: null,
	contents: null,
	footer: null
});
