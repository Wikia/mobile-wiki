define('mobile-wiki/components/ab-test', ['exports', 'mobile-wiki/modules/abtest'], function (exports, _abtest) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		didReceiveAttrs: function didReceiveAttrs() {
			this._super.apply(this, arguments);
			var experiment = this.get('experiment'),
			    usersGroup = (0, _abtest.getGroup)(experiment);

			this.set('group', usersGroup);
		}
	});
});