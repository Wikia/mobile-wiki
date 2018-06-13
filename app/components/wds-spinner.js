import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
	classNameBindings: ['overlay:wds-spinner__overlay'],

	active: false,
	overlay: true,
	isBlock: false,
	isThemed: true,
	radius: 30,
	strokeWidth: 6,

	spinnerClasses: computed('isBlock', function () {
		return `wds-spinner ${this.isBlock ? 'wds-spinner__block' : ''}`;
	}),

	strokeClasses: computed('isThemed', function () {
		return `wds-spinner__stroke ${this.isThemed ? 'wds-spinner__stroke-theme-color' : ''}`;
	}),

	// 'isVisible' is set to false also when 'active' is undefined.
	// This way it is not needed to initialize it in components.
	isVisible: computed('active', function () {
		return Boolean(this.active);
	}),

	fullRadius: computed('radius', function () {
		return this.radius + (this.strokeWidth / 2);
	}),

	fullDiameter: computed('radius', function () {
		return this.radius * 2 + this.strokeWidth;
	}),

	strokeLength: computed('radius', function () {
		return 2 * Math.PI * this.radius;
	})
});
