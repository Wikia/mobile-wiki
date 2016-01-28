/* eslint no-undefined:0 */

/**
 * Returns localStorage or compatible in-memory object
 *
 * @returns {Object}
 */
export default function () {
	return (('localStorage' in window) && window.localStorage) ?
		window.localStorage :
		{
			_data: {},

			setItem(id, value) {
				const val = String(value);

				this._data[id] = val;
				return val;
			},

			getItem(id) {
				return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
			},

			removeItem(id) {
				const val = this._data[id];

				delete this._data[id];
				return val;
			},

			clear() {
				this._data = {};

				return {};
			}
		};
}
