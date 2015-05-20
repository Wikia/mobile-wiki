/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
///<reference path="../models/CuratedContentModel.ts"/>
'use strict';

App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
	classNames: ['curated-content'],
	classNameBindings: ['showItems'],
	globalNavHeight: 57,

	topLevelSection: null,
	sectionsStack: Em.A(),

	currentSection: Em.computed('sectionsStack.@each', function (): CuratedContentItem {
		return this.get('sectionsStack.lastObject');
	}),

	didInsertElement: function (): void {
		this.set('model', App.CuratedContentModel.create());
		this.set('spinnerDelay', 50);
		this.createTopLevelSection();
	},

	willDestroyElement: function (): void {
		this.sectionsStack.clear();
	},

	actions: {
		clickItem: function (item: CuratedContentItem): void {
			if (item.type === 'section' || item.type === 'category') {
				this.loadSection(item);
			} else {
				this.trackClick('modular-main-page', 'curated-content-item-article');
			}
		},

		goBack: function (): void {
			this.trackClick('modular-main-page', 'curated-content-back');
			this.sectionsStack.popObject();
		}
	},

	createTopLevelSection: function (): void {
		var topLevelSection: CuratedContentSection,
			topLevelSectionItems: CuratedContentItem[];

		topLevelSectionItems = this.get('topLevelSection').map((item: any): CuratedContentItem => {
			return this.get('model').sanitizeItem(item, 'topLevelSection');
		});

		topLevelSection = {
			items: topLevelSectionItems,
			isTopSection: true
		};

		this.sectionsStack.pushObject(topLevelSection);
	},

	loadSection: function (item: CuratedContentItem): void {
		var sectionName: string,
			currentLevel = this.get('sectionsStack.length') - 1,
			nonInteractive = currentLevel > 0;

		this.showLoader();
		this.trackClick('modular-main-page', 'curated-content-item-level-' + currentLevel, nonInteractive);

		if (item.type === 'section') {
			sectionName = item.label;
		} else {
			// Remove Category: (or a localized one) prefix
			sectionName = item.categoryName.substr(item.categoryName.indexOf(':') + 1);
		}

		this.get('model')
			.fetchItemsForSection(sectionName, item.type)
			.then((items: CuratedContentItem[]): void => {
				var section: CuratedContentSection = {
					label: item.label,
					items: items,
					isTopSection: false
				};

				this.sectionsStack.pushObject(section);

				this.hideLoader();
				$('html, body').animate({
					scrollTop: this.$().offset().top - this.get('globalNavHeight')
				}, 500);
			})
			.catch((): void => {
				// TODO what now? should we show an error message?
				this.hideLoader();
			});
	}
});
