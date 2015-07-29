App.ObjectUtilitiesMixin = Em.Mixin.create({
	toJSON: function() {
		var value: any,
			keys: any[] = [];
		for (var key in this) {
			if (this.hasOwnProperty(key)) {
				value = this[key];
				if (value === 'toString') {
					continue;
				} // ignore useless items
				if (Ember.typeOf(value) === 'function') {
					continue;
				}
				keys.push(key);
			}
		}

		return this.getProperties(keys);
	}
});
