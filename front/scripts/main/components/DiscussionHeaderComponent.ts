/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
'use strict';

App.DiscussionHeaderComponent = Em.Component.extend(App.HeadroomMixin, {
	classNames: ['discussion-header'],

	sortMessageKey: null,

	sortTypes: [
		{
			name: 'latest',
			messageKey: 'discussion.sort-by-latest'
		},
		{
			name: 'trending',
			messageKey: 'discussion.sort-by-trending'
		}
	],

	siteName: Em.computed(function (): string {
		return Em.get(Mercury, 'wiki.siteName');
	}),

	init: function () {
		this.set('sortMessageKey', this.getSortMessageKey(this.container.lookup('route:discussion.forum').get('sortBy')));
		this._super();
	},

	/**
	 * Gets i18n message key for sort-by text
	 * @param {string} sortBy
	 */
	getSortMessageKey: function (sortBy: string) {
		var filtered = this.get('sortTypes').filter((obj: any): boolean => {
				return obj.name === sortBy;
			});

			return filtered.length ? filtered[0].messageKey :
				this.get('sortTypes')[0].messageKey;
	},

	actions: {
		setSortBy: function (sortBy: string): void {
			// Send action up to route object
			this.sendAction('setSortBy', sortBy);
			// Update the translated sort-by text
			this.set('sortMessageKey', this.getSortMessageKey(sortBy));
		},

		showSortSelector: function (): void {
			this.$('.sort-select').show();
		},

		hideSortSelector: function (): void {
			this.$('.sort-select').hide();
		}
	}
});
