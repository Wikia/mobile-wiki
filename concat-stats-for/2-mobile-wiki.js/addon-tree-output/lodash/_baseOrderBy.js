define('lodash/_baseOrderBy', ['exports', 'lodash/_arrayMap', 'lodash/_baseIteratee', 'lodash/_baseMap', 'lodash/_baseSortBy', 'lodash/_baseUnary', 'lodash/_compareMultiple', 'lodash/identity'], function (exports, _arrayMap, _baseIteratee, _baseMap, _baseSortBy, _baseUnary, _compareMultiple, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.orderBy` without param guards.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
   * @param {string[]} orders The sort orders of `iteratees`.
   * @returns {Array} Returns the new sorted array.
   */
  function baseOrderBy(collection, iteratees, orders) {
    var index = -1;
    iteratees = (0, _arrayMap.default)(iteratees.length ? iteratees : [_identity.default], (0, _baseUnary.default)(_baseIteratee.default));

    var result = (0, _baseMap.default)(collection, function (value, key, collection) {
      var criteria = (0, _arrayMap.default)(iteratees, function (iteratee) {
        return iteratee(value);
      });
      return { 'criteria': criteria, 'index': ++index, 'value': value };
    });

    return (0, _baseSortBy.default)(result, function (object, other) {
      return (0, _compareMultiple.default)(object, other, orders);
    });
  }

  exports.default = baseOrderBy;
});