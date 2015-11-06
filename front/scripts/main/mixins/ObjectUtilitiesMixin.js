App.ObjectUtilitiesMixin = Em.Mixin.create({
	/**
	 * @returns {Object}
	 */
	toPlainObject() {
		const keys = [];

		for (const key in this) {
			if (this.hasOwnProperty(key)) {
				const value = this[key];

				// ignore useless items
				if (value !== 'toString' && Em.typeOf(value) !== 'function' && typeof value !== 'function') {
					keys.push(key);
				}
			}
		}

		return this.getProperties(keys);
	}
});
