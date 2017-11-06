define('mobile-wiki/components/portable-infobox', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/utils/track'], function (exports, _viewport, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		classNames: ['portable-infobox'],
		classNameBindings: ['collapsed'],
		expandButtonClass: 'pi-expand-button',
		layoutName: 'components/portable-infobox',
		tagName: 'aside',

		height: null,
		infoboxHTML: '',
		collapsed: false,

		button: Ember.computed('expandButtonClass', function () {
			return this.$('.' + this.get('expandButtonClass'))[0];
		}),

		/**
   * determines if this infobox is a short one or a long one (needs collapsing)
   */
		isLongInfobox: Ember.computed('collapsedHeight', 'height', {
			get: function get() {
				var collapsedHeight = this.get('collapsedHeight'),
				    height = this.get('height');

				return height > collapsedHeight;
			}
		}),

		/**
   * return height which should have the collapsed infobox,
   * basing on the viewport width.
   * It's taken from 9/16 proportions of screen (width * 16 / 9 + 100px).
   * We want to always show the image AND some other infobox informations to
   * indicate that this is infobox, not only an ordinary image.
   */
		collapsedHeight: Ember.computed('viewportDimensions.width', 'viewportDimensions.height', function () {
			var deviceWidth = this.get('viewportDimensions.width'),
			    deviceHeight = this.get('viewportDimensions.height'),
			    isLandscape = deviceWidth > deviceHeight;

			return Math.floor((isLandscape ? deviceHeight : deviceWidth) * 16 / 9) + 100;
		}),

		didInsertElement: function didInsertElement() {
			if (this.get('isLongInfobox')) {
				this.collapse();
			}
		},
		collapse: function collapse() {
			this.set('collapsed', true);
			this.$().height(this.get('collapsedHeight'));
		},
		expand: function expand() {
			this.set('collapsed', false);
			this.$().height('auto');
		},


		actions: {
			toogleInfobox: function toogleInfobox() {
				if (!this.get('collapsed')) {
					var body = window.document.body,
					    scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

					this.collapse();
					(0, _track.track)({
						action: _track.trackActions.click,
						category: 'portable-infobox',
						label: 'collapsed-by-button'
					});
					scrollTo.apply(this.get('button'));
				} else {
					this.expand();
					(0, _track.track)({
						action: _track.trackActions.click,
						category: 'portable-infobox',
						label: 'expanded-by-button'
					});
				}
			}
		}
	});
});