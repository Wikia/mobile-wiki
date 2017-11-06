define('lodash/forEachRight', ['exports', 'lodash/_arrayEachRight', 'lodash/_baseEachRight', 'lodash/_castFunction', 'lodash/isArray'], function (exports, _arrayEachRight, _baseEachRight, _castFunction, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.forEach` except that it iterates over elements of
   * `collection` from right to left.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @alias eachRight
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEach
   * @example
   *
   * _.forEachRight([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `2` then `1`.
   */
  function forEachRight(collection, iteratee) {
    var func = (0, _isArray.default)(collection) ? _arrayEachRight.default : _baseEachRight.default;
    return func(collection, (0, _castFunction.default)(iteratee));
  }

  exports.default = forEachRight;
});