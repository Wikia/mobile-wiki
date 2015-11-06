/**
 * @param {*} val
 * @returns {boolean} isPrimitive
 */
export default function (val) {
	const typeOf = typeof val;

	return (val === null) ||
		(typeOf === 'string') ||
		(typeOf === 'number') ||
		(typeOf === 'boolean') ||
		(typeOf === 'undefined');
}
