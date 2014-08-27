/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

App.ArticleController = Em.ObjectController.extend({
	needs: ['application'],
	actions: {
		updateHeaders: function(headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},
		changePage: function(title: string) {
			//this is temporary solution
			//this requires refactoring adEngine to support UMD

			if (require) {
				require([
					'ext.wikia.adEngine.adEngine',
					'ext.wikia.adEngine.adConfigMobile'
				], function(adEngine: any, adConfigMobile: any){

					adEngine.run( adConfigMobile, JSON.parse(JSON.stringify(Wikia.ads.slots)), 'queue.mobile' );
				});
			}

			this.transitionToRoute('article', title);
		},
		// Bubbled up from ArticleSectionHeaderView, which is a child of ArticleView
		scrollToTop: function () {
			window.scrollTo(0, 0);
		}
	},
	displayUsers: function () {
		return this.get('users').slice(0, 5);
	}.property('users')
});
