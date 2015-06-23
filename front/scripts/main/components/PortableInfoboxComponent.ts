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
	collapsed: false,

	/**
	 * @desc determines if this infobox is
	 * a short one or a long one (needs collapsing)
	 * @return boolean true if infobox is long
	 */
	isLongInfobox: Em.computed('collapsedHeight', 'height', {
		get(): boolean {
			var collapsedHeight = this.get('collapsedHeight'),
				height = this.get('height');

			return height > collapsedHeight;
		}
	}),

	/**
	 * @desc return height which should have the collapsed infobox,
	 * basing on the viewport width.
	 * It's taken from 9/16 proportions of screen (width * 16 / 9 + 100px).
	 * We want to always show the image AND some other infobox informations to
	 * indicate that this is infobox, not only an ordinary image.
	 */
	collapsedHeight: Em.computed('viewportDimensions.width', function (): number {
		var deviceWidth = this.get('viewportDimensions.width');

		return Math.floor(deviceWidth * 16 / 9) + 100;
	}),

	handleCollapsing: function (): void {
		var collapsedHeight = this.get('collapsedHeight');

		this.set('collapsed', true);
		this.$().height(collapsedHeight);
	},

	/**
	 * @desc handles click on infobox.
	 * Function is active only for the long infoboxes.
	 * Changes 'collapsed' property.
	 */
	onInfoboxClick: function (event: JQueryEventObject): void {
		var body: HTMLElement,
			button: HTMLElement,
			expandButtonClass: string,
			scrollTo: (top?: boolean) => void,
			collapsed = this.get('collapsed'),
			$target = $(event.target);

		if ($target.is('a')) {
			return;
		}

		if (!collapsed) {
			body = window.document.body;
			expandButtonClass = this.get('expandButtonClass');
			button = this.$('.' + expandButtonClass)[0];
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

			this.handleCollapsing();
			scrollTo.apply(button);
		} else {
			this.set('collapsed', false);
			this.$().height('auto');
		}
	},

	/**
	 * @desc In case of long infobox, setups click
	 * handling function to this infobox component.
	 */
	didInsertElement: function () {
		if (this.get('isLongInfobox')) {
			this.handleCollapsing();
			this.$().click((event: JQueryEventObject) => {
				this.onInfoboxClick(event);
			});
		}
	}
});
