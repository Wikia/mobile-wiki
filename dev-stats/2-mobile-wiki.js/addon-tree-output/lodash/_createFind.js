define('lodash/_createFind', ['exports', 'lodash/_baseIteratee', 'lodash/isArrayLike', 'lodash/keys'], function (exports, _baseIteratee, _isArrayLike, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function (collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!(0, _isArrayLike.default)(collection)) {
        var iteratee = (0, _baseIteratee.default)(predicate, 3);
        collection = (0, _keys.default)(collection);
        predicate = function predicate(key) {
          return iteratee(iterable[key], key, iterable);
        };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }

  exports.default = createFind;
});