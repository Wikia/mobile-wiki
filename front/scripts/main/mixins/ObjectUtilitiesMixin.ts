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

				if (Ember.typeOf(value) === 'function') {
					continue;
				}

				keys.push(key);
			}
		}

		return this.getProperties(keys);
	}
});
