interface Window {
	[key: string]: any;
}

interface ObjectProperties {
	configurable?: boolean;
	enumerable?: boolean;
	writable?: boolean;
	value: any;
}

module Mercury {

	function namespacer(str: string, ns: any, val: any, mutable?: boolean): any  {
		var parts: string[],
			i: number,
			properties: ObjectProperties;

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

		properties = {
			value: val
		};

		if (mutable) {
			properties.configurable = true;
			properties.enumerable = true;
			properties.writable = true;
		}

		for (i = 0; i < parts.length; i++) {
			// if a obj is passed in and loop is assigning last variable in namespace
			if (i === parts.length - 1) {
				Object.defineProperty(ns, parts[i], properties);
			} else {
				// if namespace doesn't exist, instantiate as empty object
				ns = ns[parts[i]] = ns[parts[i]] || {};
			}
		}

		return ns;
	}

	export module Utils {

		var __props__: any = {};

		/**
		 * _getProp
		 * @description Accessor for private __props__ object
		 * @param key: string A key representing the namespace to set. eg 'foo.bar.baz'
		 * @return any
		 */
		export function _getProp (key: string): any {
			var parts = key.split('.'),
				value: any,
				i: number;

			if (parts.length > 1) {
				i = 0;
				value = __props__;
				while (i < parts.length) {
					if (!value.hasOwnProperty(parts[i])) {
						return;
					}
					value = value[parts[i]];
					i++;
				}
				return value;
			}
			return __props__[key];
		};

		/**
		 * _setProp
		 * @description Setter for single properties on the private __props__ object
		 * @param key: string A key representing the namespace to set. eg 'foo.bar.baz'
		 * @param value: any Any non-undefined value
		 * @param mutable: boolean When set to true, the parameters given to Object.defineProperty are relaxed
		 * @return any
		 */
		export function _setProp (key: string, value: any, mutable: boolean): any {
			if (typeof value === 'undefined') {
				throw 'Cannot set property ' + key + ' to ' + value;
			}
			return namespacer(key, __props__, value, mutable);
		}

		/**
		 * prop
		 *
		 * @param key: string
		 * @param value?: any
		 * @param mutable = false
		 * @return any
		 */
		export function prop (key: string, value?: any, mutable = false): any {
			if (typeof value !== 'undefined') {
				return _setProp(key, value, mutable);
			}
			return _getProp(key);
		}

		export function provide(str: string, obj: any): any {
			if (typeof str !== 'string') {
				throw Error('Invalid string supplied to namespacer');
			}
			return namespacer(str, 'Mercury', obj, true);
		}
	}
}

// alias M for quick access to utility functions
var M = Mercury.Utils;
