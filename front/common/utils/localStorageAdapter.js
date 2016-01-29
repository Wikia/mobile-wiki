/**
 * Returns localStorage or compatible in-memory object
 *
 * @returns {Object}
 */
const localStorageAdapter = (('localStorage' in window) && window.localStorage) ?
	window.localStorage :
	{
		_data: {},

		setItem(id, value) {
			const val = String(value);

			this._data[id] = val;
			return val;
		},

		getItem(id) {
			if (this._data.hasOwnProperty(id)) {
				return this._data[id];
			}

			// non-explict return undefined
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

export default localStorageAdapter;
