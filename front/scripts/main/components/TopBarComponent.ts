/// <reference path="../app.ts" />
/// <reference path="../mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
'use strict';

App.TopBarComponent = Em.Component.extend({
	classNames: ['top-bar-component'],
	logoHref: Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com')
});
