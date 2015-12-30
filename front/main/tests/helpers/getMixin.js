export default function (mixinName) {
	var mixin = require('main/mixins/' + mixinName).default,
		classWithMixin = Ember.Object.extend(mixin);

	return classWithMixin.create({});
}
