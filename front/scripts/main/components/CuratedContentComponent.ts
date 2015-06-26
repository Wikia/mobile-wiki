/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
///<reference path="../models/CuratedContentModel.ts"/>
'use strict';

App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
	classNames: ['curated-content'],
	classNameBindings: ['showItems'],
	globalNavHeight: 57,
	spinnerDelay: 50,

	//actions: {
	//	clickItem: function (item: CuratedContentItem): void {
	//		if (item.type === 'section' || item.type === 'category') {
	//			this.loadSection(item);
	//		} else {
	//			this.trackClick('modular-main-page', 'curated-content-item-article');
	//		}
	//	}
	//},
	//
	//loadSection: function (item: CuratedContentItem): void {
	//	var sectionName: string,
	//		currentLevel = this.get('sectionsStack.length') - 1,
	//		nonInteractive = currentLevel > 0;
	//
	//	this.showLoader();
	//	this.trackClick('modular-main-page', 'curated-content-item-level-' + currentLevel, nonInteractive);
	//
	//	if (item.type === 'section') {
	//		sectionName = item.label;
	//	} else {
	//		// Remove Category: (or a localized one) prefix
	//		sectionName = item.categoryName.substr(item.categoryName.indexOf(':') + 1);
	//	}
	//
	//	this.get('model')
	//		.fetchItemsForSection(sectionName, item.type)
	//		.then((items: CuratedContentItem[]): void => {
	//			this.onSectionLoaded(items, item);
	//		})
	//		.catch((): void => {
	//			// TODO what now? should we show an error message?
	//			this.hideLoader();
	//		});
	//},
	//
	//onSectionLoaded: function (items: CuratedContentItem[], parent: CuratedContentItem): void {
	//	var section: CuratedContentSection = {
	//		label: parent.label,
	//		items: items,
	//		isTopSection: false
	//	};
	//
	//	this.sectionsStack.pushObject(section);
	//
	//	this.hideLoader();
	//	$('html, body').animate({
	//		scrollTop: this.$().offset().top - this.get('globalNavHeight')
	//	}, 500);
	//}
});
