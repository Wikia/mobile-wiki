define('mobile-wiki/mixins/object-utilities', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var typeOf = Ember.typeOf;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		/**
   * @returns {Object}
   */
		toPlainObject: function toPlainObject() {
			var keys = [];

			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					var value = this[key];

					// ignore useless items
					if (value !== 'toString' && typeOf(value) !== 'function' && typeof value !== 'function') {
						keys.push(key);
					}
				}
			}

			return this.getProperties(keys);
		}
	});
});