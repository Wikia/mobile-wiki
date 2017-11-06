define('lodash/shuffle', ['exports', 'lodash/_arrayShuffle', 'lodash/_baseShuffle', 'lodash/isArray'], function (exports, _arrayShuffle, _baseShuffle, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array of shuffled values, using a version of the
   * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to shuffle.
   * @returns {Array} Returns the new shuffled array.
   * @example
   *
   * _.shuffle([1, 2, 3, 4]);
   * // => [4, 1, 3, 2]
   */
  function shuffle(collection) {
    var func = (0, _isArray.default)(collection) ? _arrayShuffle.default : _baseShuffle.default;
    return func(collection);
  }

  exports.default = shuffle;
});