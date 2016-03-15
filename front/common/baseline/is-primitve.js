if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * @param {*} val
	 * @returns {boolean} isPrimitive
	 */
	M.isPrimitive = function (val) {
		const typeOf = typeof val;

		return (val === null) ||
			(typeOf === 'string') ||
			(typeOf === 'number') ||
			(typeOf === 'boolean') ||
			(typeOf === 'undefined');
	};
})(M);
