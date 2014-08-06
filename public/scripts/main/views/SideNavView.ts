/// <reference path="../app.ts" />
'use strict';

App.SideNavView = Em.View.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed:hidden:slide-into-view'],
	isCollapsed: true,
	layoutName: 'view/side-nav',

	// searchModeObserver: function () {
	// 	debugger;
	// 	if (!this.get('controller.isInSearchMode')) {
	// 		this.send('clearSearch');
	// 	}
	// }.observes('controller.isInSearchMode').on('didInsertElement'),

	actions: {
		expandSideNav: function (): void {
			this.set('isCollapsed', false);
			Ember.$('body').addClass('no-scroll');
		},
		collapseSideNav: function (): void {
			console.log('collapsing');
			this.set('controller.isInSearchMode', false);
			this.set('isCollapsed', true);
			Ember.$('body').removeClass('no-scroll');
		}
		// /**
		//  * Action for 'x' button in search box -- not sure what
		//  * it's supposed to do but right now it clears the text.
		//  */
		// clearSearch: function (): void {
		// 	if (this.get('controllers.localWikiSearch')) {
		// 		this.set('controllers.localWikiSearch.query', '');
		// 	}
		// 	debugger;
		// 	// var $searchBox = this.$('input');
		// 	// // Have to make this check in case it isn't rendered yet.
		// 	// if ($searchBox) {
		// 	// 	$searchBox.val('');
		// 	// }
		// }
	}
});
