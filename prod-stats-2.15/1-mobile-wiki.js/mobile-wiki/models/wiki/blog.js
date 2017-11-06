define('mobile-wiki/models/wiki/blog', ['exports', 'mobile-wiki/models/wiki/base'], function (exports, _base) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _base.default.extend({
		comments: 0,

		/**
   * @param {Object} data
   * @returns {void}
   */
		setData: function setData(_ref) {
			var data = _ref.data;

			this._super.apply(this, arguments);

			if (data && data.details) {
				this.set('comments', data.details.comments);
			}
		}
	});
});