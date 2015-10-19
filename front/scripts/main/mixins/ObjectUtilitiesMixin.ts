App.ObjectUtilitiesMixin = Em.Mixin.create({
	/**
	 * @returns {any}
	 */
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
	}
});
