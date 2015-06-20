/// <reference path="../app.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.PortableInfoboxComponent = Em.Component.extend(App.ArticleContentMixin, App.ViewportMixin, {
	classNames: ['portable-infobox'],
	classNameBindings: ['collapsed'],
	expandButtonClass: 'portable-infobox-expand-button',
	layoutName: 'components/portable-infobox',

	height: null,
	infoboxHTML: '',
	collapsed: null,

	isLongInfobox: Em.computed({
		get(): boolean {
			var collapsedHeight = this.get('collapsedHeight'),
				height = this.get('height');
			return height > collapsedHeight ? true : false;
		}
	}),

	collapsedHeight: Em.computed('viewportDimensions.width', function() {
		var deviceWidth = this.get('viewportDimensions.width');
		return Math.floor(deviceWidth * 16 / 9) + 100;
	}),

	handleCollapsing: function(): void {
		var collapsedHeight = this.get('collapsedHeight'),
			$this = this.$();

		this.set('collapsed', true);
		$this.height(collapsedHeight);
	},

	onInfoboxClick: function(): void {
		var button: HTMLButtonElement,
			collapsedHeight = this.get('collapsedHeight'),
			expandButtonClass = this.get('expandButtonClass'),
			body = window.document.body,
			collapsed = this.get('collapsed'),
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView,
			$target = $(event.target),
			$this = this.$();

		if (!$target.is('a') && !collapsed) {
            button = this.$('.' + expandButtonClass)[0];

			$this.height(collapsedHeight);
			scrollTo.apply(button);
		} else {
			$this.height('auto');
		}

		this.toggleProperty('collapsed');
	},

	didInsertElement: function() {
		if (this.get('isLongInfobox')) {
			this.handleCollapsing();
			this.$().click(() => {
				this.onInfoboxClick();
			});
		}
	}
});
