/// <reference path="../app.ts" />
/// <reference path="../mixins/LightboxMixin.ts" />
/// <reference path="./LightboxView.ts" />
'use strict';

App.AdsLightboxView = App.LightboxView.extend(App.LightboxMixin, {
	classNames: ['ads-lightbox']
});
