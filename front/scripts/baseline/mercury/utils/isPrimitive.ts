module Mercury.Utils {
	/**
	 * @param {any} val
	 * @returns {boolean}  isPrimitive
	 */
	export function isPrimitive (val: any) {
		var typeOf = typeof val;
		return (val === null) ||
				(typeOf === 'string') ||
				(typeOf === 'number') ||
				(typeOf === 'boolean') ||
				(typeOf === 'undefined');
	}
}
