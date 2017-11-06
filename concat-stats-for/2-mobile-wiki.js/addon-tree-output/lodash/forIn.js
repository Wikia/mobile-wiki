define('lodash/forIn', ['exports', 'lodash/_baseFor', 'lodash/_castFunction', 'lodash/keysIn'], function (exports, _baseFor, _castFunction, _keysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Iterates over own and inherited enumerable string keyed properties of an
   * object and invokes `iteratee` for each property. The iteratee is invoked
   * with three arguments: (value, key, object). Iteratee functions may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @since 0.3.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns `object`.
   * @see _.forInRight
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.forIn(new Foo, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
   */
  function forIn(object, iteratee) {
    return object == null ? object : (0, _baseFor.default)(object, (0, _castFunction.default)(iteratee), _keysIn.default);
  }

  exports.default = forIn;
});