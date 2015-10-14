/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['discussion-header'],
	// TODO: not sure this is always accurate
	smartBannerVisible: Em.computed.alias('controllers.application.smartBannerVisible'),

	siteName: Em.computed(function (): string {
		return Em.get(Mercury, 'wiki.siteName');
	}),
	overlay: null,

	showContent: true,

	didInsertElement(): void {
		this.set('overlay', this.element.querySelector('.overlay'));
		this._super();
	},

	actions: {
		showSortComponent(): void {
			this.sendAction('showSortComponent');
			this.get('overlay').style.display = 'block';
		},

		hideSortComponent(): void {
			this.sendAction('hideSortComponent');
			this.get('overlay').style.display = 'none';
		}
	}
});
