/// <reference path="../app.ts" />

/**
 * Mixin that sends 'onVisible' action when element appears on screen for the first time.
 *
 * default threshold is 400 to change define property threshold in a component
 */
'use strict';

App.VisibleMixin = Em.Mixin.create({
	visibleShared: {
		initialized: false,
		components: [],
		threshold: 400
	},

	isVisible: function(element: JQuery, visibleBottom: number, visibleTop: number): boolean {
		var threshold = this.threshold || this.visibleShared.threshold,
			top = element.offset().top - threshold,
			bottom = top + element.height() + threshold;

		return visibleBottom >= top && visibleTop <= bottom;
	},

	check: function () {
		var components = this.visibleShared.components,
			i = components.length,
			component: Em.Component,
			// in IE10 window.scrollY doesn't work
			// but window.pageYOffset is basically the same
			// https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
			wTop = window.scrollY || window.pageYOffset,
			wBottom = wTop + window.innerHeight;

		if (i > 0) {
			while(i--) {
				component = components[i];

				if (this.isVisible(component.$(), wBottom, wTop)) {
					component.send('onVisible');
					components.splice(i, 1);
				}
			}
		} else {
			window.removeEventListener('scroll', () => this.checkDebounced());
			this.set('visibleShared.initialized', false);
		}
	},

	checkDebounced: function () {
		Em.run.debounce(this, this.check, 50);
	},

	init: function () {
		this._super();

		this.visibleShared.components.push(this);

		if (!this.get('visibleShared.initialized')) {
			window.addEventListener('scroll', () => this.checkDebounced());

			this.checkDebounced();
			this.set('visibleShared.initialized', true)
		}
	}
});
