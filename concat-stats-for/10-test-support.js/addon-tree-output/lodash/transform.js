define('lodash/transform', ['exports', 'lodash/_arrayEach', 'lodash/_baseCreate', 'lodash/_baseForOwn', 'lodash/_baseIteratee', 'lodash/_getPrototype', 'lodash/isArray', 'lodash/isBuffer', 'lodash/isFunction', 'lodash/isObject', 'lodash/isTypedArray'], function (exports, _arrayEach, _baseCreate, _baseForOwn, _baseIteratee, _getPrototype, _isArray, _isBuffer, _isFunction, _isObject, _isTypedArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * An alternative to `_.reduce`; this method transforms `object` to a new
   * `accumulator` object which is the result of running each of its own
   * enumerable string keyed properties thru `iteratee`, with each invocation
   * potentially mutating the `accumulator` object. If `accumulator` is not
   * provided, a new object with the same `[[Prototype]]` will be used. The
   * iteratee is invoked with four arguments: (accumulator, value, key, object).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @since 1.3.0
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The custom accumulator value.
   * @returns {*} Returns the accumulated value.
   * @example
   *
   * _.transform([2, 3, 4], function(result, n) {
   *   result.push(n *= n);
   *   return n % 2 == 0;
   * }, []);
   * // => [4, 9]
   *
   * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] }
   */
  function transform(object, iteratee, accumulator) {
    var isArr = (0, _isArray.default)(object),
        isArrLike = isArr || (0, _isBuffer.default)(object) || (0, _isTypedArray.default)(object);

    iteratee = (0, _baseIteratee.default)(iteratee, 4);
    if (accumulator == null) {
      var Ctor = object && object.constructor;
      if (isArrLike) {
        accumulator = isArr ? new Ctor() : [];
      } else if ((0, _isObject.default)(object)) {
        accumulator = (0, _isFunction.default)(Ctor) ? (0, _baseCreate.default)((0, _getPrototype.default)(object)) : {};
      } else {
        accumulator = {};
      }
    }
    (isArrLike ? _arrayEach.default : _baseForOwn.default)(object, function (value, index, object) {
      return iteratee(accumulator, value, index, object);
    });
    return accumulator;
  }

  exports.default = transform;
});