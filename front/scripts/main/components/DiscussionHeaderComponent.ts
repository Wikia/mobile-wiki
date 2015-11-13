/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(
	App.HeadroomMixin,
	{
		classNames: ['discussion-header', 'background-theme-color'],

		siteName: Em.computed(function (): string {
			return Em.get(Mercury, 'wiki.siteName');
		}),
		overlay: null,

		showContent: true,

		actions: {
			/**
			 * @returns {void}
			 */
			showSortComponent(): void {
				this.sendAction('showSortComponent');
				this.get('overlay').style.display = 'block';
			},

			/**
			 * @returns {void}
			 */
			hideSortComponent(): void {
				this.sendAction('hideSortComponent');
				this.get('overlay').style.display = 'none';
			},

			toggleEditorActive(active: boolean): void {
				this.sendAction('toggleEditorActive', active);
			},
		},

		/**
		 * @returns {void}
		 */
		didInsertElement(): void {
			this.set('overlay', this.element.querySelector('.overlay'));
			this._super();
		},
	}
);
