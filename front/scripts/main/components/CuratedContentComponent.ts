/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

interface CuratedContentSection {
	items: CuratedContentItem[];
	isTopSection: boolean;
	label?: string;
}

interface CuratedContentItem {
	label: string;
	imageUrl: string;
	type: string;
	url?: string;
}

App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
	classNames: ['curated-content'],
	classNameBindings: ['showItems'],
	globalNavHeight: 57,

	topLevelSection: null,
	sectionsStack: Em.A(),

	currentSection: Em.computed('sectionsStack.@each', function (): CuratedContentItem {
		return this.get('sectionsStack.lastObject');
	}),

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentModel.create());
		this.set('spinnerDelay', 50);
		this.createTopLevelSection();
	},

	actions: {
		clickItem: function (item: CuratedContentItem): void {
			if (item.type === 'section' || item.type === 'category') {
				this.loadSection(item);
			} else {
				this.loadItem(item);
			}
		},

		goBack: function (): void {
			this.sectionsStack.popObject();
		},

		showItems: function (item: any): void {
			this.showLoader();
			this.trackClick('modular-main-page', 'curated-content-item-level-0', false);
			this.get('model').fetchItemsForSection(item.title)
				.then((): void => {
					this.hideLoader();
					this.set('showItems', true);
					$('html, body').animate({
						scrollTop: this.$().offset().top - this.get('globalNavHeight')
					}, 500);
				});
		},

		showGrid: function(): void {
			this.set('showItems', false);
			this.get('model').set('activeSection', false);
			this.trackClick('modular-main-page', 'curated-content-back');
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
		var sectionName: string;

		this.showLoader();

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
				// TODO what now?
				this.hideLoader();
			});
	},

	loadItem: function (item: CuratedContentItem): void {
		console.log('#### LOAD SOME ITEM', item);
	}
});
