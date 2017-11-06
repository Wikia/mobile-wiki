define('mobile-wiki/utils/local-storage-connector', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
  * @typedef {Object} LocalStorage
  * @property {Function} setItem
  * @property {Function} getItem
  * @property {Function} removeItem
  * @property {Function} clear
  */

	/**
  * localStorage-compatible in-memory object
  */
	var localStorageAdapter = exports.localStorageAdapter = {
		_data: {},

		/**
   * @param {string} key
   * @param {string} value
   * @returns {string}
   */
		setItem: function setItem(key, value) {
			var val = String(value);

			this._data[key] = val;
			return val;
		},


		/**
   * @param {string} key
   * @returns {string|undefined}
   */
		getItem: function getItem(key) {
			if (this._data.hasOwnProperty(key)) {
				return this._data[key];
			}

			// non-explict return undefined
		},


		/*
   * @param {string} key
   * @returns {string}
   */
		removeItem: function removeItem(key) {
			var val = this._data[key];

			delete this._data[key];
			return val;
		},


		/**
   * @returns {void}
   */
		clear: function clear() {
			this._data = {};
		}
	};

	// Check if we have local storage available
	var localStorageAvailable = false;

	try {
		var test = 'testLocalStorage';

		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		localStorageAvailable = true;
	} catch (e) {
		localStorageAvailable = false;
	}

	/**
  * Returns window.localStorage or compatible in-memory object
  *
  * @returns {LocalStorage}
  */
	exports.default = localStorageAvailable ? window.localStorage : localStorageAdapter;
});