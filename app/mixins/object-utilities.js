import {typeOf} from '@ember/utils';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	/**
	 * @returns {Object}
	 */
	toPlainObject() {
		const keys = [];

		for (const key in this) {
			if (this.hasOwnProperty(key)) {
				const value = this[key];

				// ignore useless items
				if (value !== 'toString' && typeOf(value) !== 'function' && typeof value !== 'function') {
					keys.push(key);
				}
			}
		}

		return this.getProperties(keys);
	}
});
