import { typeOf } from '@ember/utils';
import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  /**
  * @returns {Object}
  */
  toPlainObject() {
    const keys = Object.entries(this).map((property) => {
      const key = property[0];
      const value = property[1];

      // ignore useless items
      if (value !== 'toString' && typeOf(value) !== 'function' && typeof value !== 'function') {
        return key;
      }

      return false;
    });

    return this.getProperties(keys);
  },
});
