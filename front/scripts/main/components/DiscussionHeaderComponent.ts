/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['discussion-header'],

	siteName: Em.computed((): string => {
		return Em.get(Mercury, 'wiki.siteName');
	})
});
