define('lodash/forInRight', ['exports', 'lodash/_baseForRight', 'lodash/_castFunction', 'lodash/keysIn'], function (exports, _baseForRight, _castFunction, _keysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.forIn` except that it iterates over properties of
   * `object` in the opposite order.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns `object`.
   * @see _.forIn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.forInRight(new Foo, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
   */
  function forInRight(object, iteratee) {
    return object == null ? object : (0, _baseForRight.default)(object, (0, _castFunction.default)(iteratee), _keysIn.default);
  }

  exports.default = forInRight;
});