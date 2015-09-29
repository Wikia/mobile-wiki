/// <reference path="../app.ts" />
// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.ShareHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['share-header'],
	headroomOptions: {
		classes: {
			initial: 'pinned',
			pinned: 'pinned'
		}
	}
});
