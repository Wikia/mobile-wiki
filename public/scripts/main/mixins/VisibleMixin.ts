/// <reference path="../app.ts" />

/**
 * Mixin that sends 'onVisible' action when element appears on screen for the first time.
 *
 * default threshold is 400 to change define property threshold in a component
 */
'use strict';

App.IsVisible = Em.Object.create({

	initialized: false,
	components: [],

	isVisible: function(element: JQuery, visibleBottom: number, visibleTop: number, threshold: number = 400): boolean {
		var top = element.offset().top - threshold,
		    bottom = top + element.height() + threshold;

		return visibleBottom >= top && visibleTop <= bottom;
	},

	check: function () {
		var components = this.components,
		    i = components.length,
		    component: Em.Component,
		    // in IE10 window.scrollY doesn't work
		    // but window.pageYOffset is basically the same
		    // https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
		    wTop = window.scrollY || window.pageYOffset,
		    wBottom = wTop + window.innerHeight;
		console.log(components)
		if (i > 0) {
			while(i--) {
				component = components[i];

				if (this.isVisible(component.$(), wBottom, wTop, component.threshold)) {
					component.send('onVisible');
					components.splice(i, 1);
				}
			}
		} else {
			$(window).off('scroll.isVisible');
			this.initialized = false;
		}
	},

	checkDebounced: function () {
		Em.run.debounce(this, this.check, 50);
	},

	add: function (component: Em.Component) {

		this.components.push(component);

		if (!this.initialized) {
			$(window).on('scroll.isVisible', () => this.checkDebounced());

			this.checkDebounced();
			this.initialized = true;
		}
	},

	reset: function () {
		this.components.length = 0;
		this.initialized = false;
	}
});

App.VisibleMixin = Em.Mixin.create({
	init: function () {
		this._super();

		App.IsVisible.add(this);
	}
});
