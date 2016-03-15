if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	const __props__ = {};

	/**
	 * @param {string} str
	 * @param {string|object} ns
	 * @param {*} val
	 * @param {boolean} [mutable]
	 * @returns {*}
	 */
	function namespacer(str, ns, val, mutable) {
		let parts;

		if (!str) {
			parts = [];
		} else {
			parts = str.split('.');
		}

		if (parts.length === 1 && !ns) {
			throw new Error('Uneccessary assignment, please specify more ' +
				'items in arg1 or a namespace in arg2');
		}

		if (!ns) {
			ns = window;
		}

		if (typeof ns === 'string') {
			ns = window[ns] = window[ns] || {};
		}

		const properties = {
			value: !mutable && !M.isPrimitive(val) ? Object.freeze(val) : val
		};

		if (mutable) {
			properties.configurable = true;
			properties.enumerable = true;
			properties.writable = true;
		}

		for (let i = 0; i < parts.length; i++) {
			// if a obj is passed in and loop is assigning last variable in namespace
			if (i === parts.length - 1) {
				Object.defineProperty(ns, parts[i], properties);
				ns = ns[parts[i]];
			} else {
				// if namespace doesn't exist, instantiate as empty object
				ns = ns[parts[i]] = ns[parts[i]] || {};
			}
		}

		return ns;
	}

	/**
	 * Accessor for private __props__ object
	 *
	 * @param {string} key - A key representing the namespace to set. eg 'foo.bar.baz'
	 * @returns {*}
	 */
	function _getProp(key) {
		const parts = key.split('.');

		if (parts.length > 1) {
			let value = __props__;

			for (let i = 0; i < parts.length; i++) {
				if (!value.hasOwnProperty(parts[i])) {
					return null;
				}

				value = value[parts[i]];
			}

			return value;
		}

		return __props__[key];
	}

	/**
	 * Setter for single properties on the private __props__ object
	 *
	 * @param {string} key - A key representing the namespace to set. eg 'foo.bar.baz'
	 * @param {*} value - Any non-undefined value
	 * @param {boolean} mutable - When set to true, the parameters given to Object.defineProperty are relaxed
	 * @returns {*}
	 */
	function _setProp(key, value, mutable = false) {
		if (typeof value === 'undefined') {
			throw new Error(`Cannot set property ${key} to ${value}`);
		}

		return namespacer(key, __props__, value, mutable);
	}

	/**
	 * Combined getter/setter for private __props__
	 *
	 * When `value` is set to `undefined` it's a `get`, otherwise it's a `set`.
	 *
	 * @param {string} key
	 * @param {*} [value]
	 * @param {boolean} [mutable=false]
	 * @returns {*}
	 */
	M.prop = function (key, value, mutable = false) {
		if (typeof value !== 'undefined') {
			return _setProp(key, value, mutable);
		}

		return _getProp(key);
	};

	/**
	 * Set multiple properties of __props__ at once
	 *
	 * @param {Object} value
	 * @param {boolean} [mutable=false]
	 * @returns {object} __props__
	 */
	M.props = function (value, mutable = false) {
		const props = {},
			keys = Object.keys(value);

		if (typeof mutable !== 'boolean') {
			throw new Error('Argument 2, mutable, must be a boolean value');
		}

		if (typeof value === 'string' || !keys.length) {
			throw new Error(`Unable to set properties with the supplied value: ${value} (of type ${typeof value})`);
		}

		for (let keysLength = keys.length - 1; keysLength > -1; keysLength--) {
			const curVal = value[keys[keysLength]];

			props[keys[keysLength]] = {
				value: !mutable && !M.isPrimitive(curVal) ? Object.freeze(curVal) : curVal,
				configurable: mutable,
				enumerable: mutable,
				writable: mutable
			};
		}

		Object.defineProperties(__props__, props);

		return value;
	};

	/**
	 * @param {string} str
	 * @param {*} obj
	 * @returns {*}
	 */
	M.provide = function (str, obj) {
		if (typeof str !== 'string') {
			throw Error('Invalid string supplied to namespacer');
		}

		return namespacer(str, 'Mercury', obj, true);
	};
})(M);
