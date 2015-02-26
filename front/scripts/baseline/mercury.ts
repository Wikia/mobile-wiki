interface Window {
	[key: string]: any;
}

module Mercury {
	function namespacer(str: string, ns: string, val: any): any;
	function namespacer(str: string, ns: any, val: any): any  {
		var parts: string[],
			i: number;

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

		for (i = 0; i < parts.length; i++) {
			// if a obj is passed in and loop is assigning last variable in namespace
			if (i === parts.length - 1) {
				ns = ns[parts[i]] = val;
			} else {
				// if namespace doesn't exist, instantiate as empty object
				ns = ns[parts[i]] = ns[parts[i]] || {};
			}
		}

		return ns;
	}

	export module Utils {

		var __state__: any = {};

		function _getState (key: string): any {
			var parts = key.split('.');
			if (parts.length > 1) {
				var i = 0;
				var value = __state__;
				while (i < parts.length) {
					if (!value.hasOwnProperty(parts[i])) {
						return;
					}
					value = value[parts[i]];
					i++;
				}
				return value;
			}
			return __state__[key];
		};

		function _setState (key: string, value: any): any {
			if (value === undefined || value === null) {
				throw 'Cannot set property ' + key + ' to ' + value;
			}
			return namespacer(key, __state__, value);
		}

		export function state (key: string, value?: any): any {
			if (value) {
				return _setState(key, value);
			}
			return _getState(key);
		}

		export function provide(str: string, obj: any): any {
			if (typeof str !== 'string') {
				throw Error('Invalid string supplied to namespacer');
			}
			return namespacer(str, 'Mercury', obj);
		}
	}
}

// alias M for quick access to utility functions
var M = Mercury.Utils;
