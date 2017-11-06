define('lodash/_createAggregator', ['exports', 'lodash/_arrayAggregator', 'lodash/_baseAggregator', 'lodash/_baseIteratee', 'lodash/isArray'], function (exports, _arrayAggregator, _baseAggregator, _baseIteratee, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function like `_.groupBy`.
   *
   * @private
   * @param {Function} setter The function to set accumulator values.
   * @param {Function} [initializer] The accumulator object initializer.
   * @returns {Function} Returns the new aggregator function.
   */
  function createAggregator(setter, initializer) {
    return function (collection, iteratee) {
      var func = (0, _isArray.default)(collection) ? _arrayAggregator.default : _baseAggregator.default,
          accumulator = initializer ? initializer() : {};

      return func(collection, setter, (0, _baseIteratee.default)(iteratee, 2), accumulator);
    };
  }

  exports.default = createAggregator;
});