/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />
'use strict';

App.ObjectUtilitiesMixin = Em.Mixin.create({
	toPlainObject(): any {
		var value: any,
			keys: any[] = [],
			key: any;

		for (key in this) {
			if (this.hasOwnProperty(key)) {
				value = this[key];

				// ignore useless items
				if (value === 'toString') {
					continue;
				}

				if (Ember.typeOf(value) === 'function' || typeof value === 'function') {
					continue;
				}

				keys.push(key);
			}
		}

		return this.getProperties(keys);
	},

	/**
	 * This function is used to create a normal flat obejct ready to send via API
	 * from an Ember.Object
	 *
	 * @param {Em.Object} to sanitize
	 * @return a simple object
	 */
	processEmberObject: function (data: Em.Object): any {
		var value: any,
			key: any,
			result = {};

		for (key in data) {
			if (data.hasOwnProperty(key)) {
				value = data[key];

				// ignore useless items
				if (value === 'toString') {
					continue;
				}

				if (Ember.typeOf(value) === 'function' || typeof value === 'function') {
					continue;
				}

				result[key] = value;
			}
		}
		return result;
	}
});
