/// <reference path="../app.ts" />
'use strict';

App.LazyMixin = Em.Mixin.create({
	shared: {
		initialized: false,
		components: [],
		threshold: 400
	},

	isVisible: function(element: JQuery, visibleBottom: number, visibleTop: number): boolean {
		var mayBeVisible = element && (element.height() || element.width()),
			top: number,
			bottom: number;

		if (mayBeVisible) {
			top = ~~element.offset().top - this.shared.threshold;
			bottom = top + element.height() + this.shared.threshold;

			return visibleBottom >= top && visibleTop <= bottom;
		}

		return false;
	},

	check: function () {
		var length = this.shared.components.length - 1,
			component: Em.Component,
		// in IE10 window.scrollY doesn't work
		// but window.pageYOffset is basically the same
		// https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
			wTop = window.scrollY || window.pageYOffset,
			wBottom = wTop + window.innerHeight;

		if (length >= 0) {
			for (var i = 0; i < length; i++) {
				component = this.shared.components[i];

				if (this.isVisible(component.$(), wBottom, wTop)) {
					component.send('onVisible');
					this.shared.components.splice(i, 1);
				}
			}
		} else {
			window.removeEventListener('scroll', () => this.checkDebounced());
			this.set('shared.initialized', false);
		}
	},

	checkDebounced: function () {
		Em.run.debounce(this, this.check, 50);
	},

	initialize: function () {
		if (!this.get('shared.initialized')) {
			window.addEventListener('scroll', () => this.checkDebounced());

			this.set('shared.initialized', true)
		}
	},

	init: function () {
		this._super();

		this.shared.components.push(this);
		this.initialize();
	}
});
