define('lodash/forOwnRight', ['exports', 'lodash/_baseForOwnRight', 'lodash/_castFunction'], function (exports, _baseForOwnRight, _castFunction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.forOwn` except that it iterates over properties of
   * `object` in the opposite order.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns `object`.
   * @see _.forOwn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.forOwnRight(new Foo, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
   */
  function forOwnRight(object, iteratee) {
    return object && (0, _baseForOwnRight.default)(object, (0, _castFunction.default)(iteratee));
  }

  exports.default = forOwnRight;
});