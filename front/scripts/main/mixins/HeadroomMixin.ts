/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../../../typings/headroom/headroom.d.ts" />
'use strict';

App.HeadroomMixin = Em.Mixin.create({
	headroom: null,

	// keep it consistent with values in _wikia-variables.scss
	smartBannerHeight: {
		android: 66,
		ios: 83
	},

	offset: Em.computed('smartBannerVisible', function (): number {
		if (this.get('smartBannerVisible')) {
			return this.get('smartBannerHeight.' + Mercury.Utils.Browser.getSystem());
		}
		return 0;
	}),

	/**
	 * Observes smartBannerVisible property which is controlled by SmartBannerComponent
	 * and goes through ApplicationController. Reinitializes Headroom when it changes.
	 */
	smartBannerVisibleObserver: Em.observer('smartBannerVisible', function (): void {
		var headroom = this.get('headroom');

		if (headroom) {
			headroom.destroy();
			this.initHeadroom();
		}
	}),

	didInsertElement: function () {
		this.initHeadroom();
	},

	initHeadroom: function (): void {
		var headroom: Headroom,
			options = {
				classes: {
					initial: 'headroom',
					pinned: 'pinned',
					unpinned: 'un-pinned',
					top: 'headroom-top',
					notTop: 'headroom-not-top'
				},
				offset: this.get('offset')
			};

		// If the object using this mixin provides overriding options, merge them with the default
		if (this.get('headroomOptions')) {
			options = $.extend(options, this.get('headroomOptions'));
		}

		headroom = new Headroom(this.get('element'), options);
		headroom.init();

		this.set('headroom', headroom);
	}
});
