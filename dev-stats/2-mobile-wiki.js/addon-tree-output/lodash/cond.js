define('lodash/cond', ['exports', 'lodash/_apply', 'lodash/_arrayMap', 'lodash/_baseIteratee', 'lodash/_baseRest'], function (exports, _apply, _arrayMap, _baseIteratee, _baseRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that iterates over `pairs` and invokes the corresponding
   * function of the first predicate to return truthy. The predicate-function
   * pairs are invoked with the `this` binding and arguments of the created
   * function.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Util
   * @param {Array} pairs The predicate-function pairs.
   * @returns {Function} Returns the new composite function.
   * @example
   *
   * var func = _.cond([
   *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
   *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
   *   [_.stubTrue,                      _.constant('no match')]
   * ]);
   *
   * func({ 'a': 1, 'b': 2 });
   * // => 'matches A'
   *
   * func({ 'a': 0, 'b': 1 });
   * // => 'matches B'
   *
   * func({ 'a': '1', 'b': '2' });
   * // => 'no match'
   */
  function cond(pairs) {
    var length = pairs == null ? 0 : pairs.length,
        toIteratee = _baseIteratee.default;

    pairs = !length ? [] : (0, _arrayMap.default)(pairs, function (pair) {
      if (typeof pair[1] != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return [toIteratee(pair[0]), pair[1]];
    });

    return (0, _baseRest.default)(function (args) {
      var index = -1;
      while (++index < length) {
        var pair = pairs[index];
        if ((0, _apply.default)(pair[0], this, args)) {
          return (0, _apply.default)(pair[1], this, args);
        }
      }
    });
  }

  exports.default = cond;
});