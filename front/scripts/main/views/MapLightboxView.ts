/// <reference path="../app.ts" />
/// <reference path="../mixins/LightboxMixin.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.MapLightboxView = App.LightboxView.extend(App.LightboxMixin, {
	classNames: ['map-lightbox']
});
