import { typeOf } from '@ember/utils';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * @returns {Object}
  */
  toPlainObject() {
    const keys = Object.entries(this).map(([key, value]) => {
      // ignore useless items
      if (value !== 'toString' && typeOf(value) !== 'function' && typeof value !== 'function') {
        return key;
      }

      return false;
    });

    return this.getProperties(keys);
  },
});
