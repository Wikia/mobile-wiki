define('lodash/_createOver', ['exports', 'lodash/_apply', 'lodash/_arrayMap', 'lodash/_baseIteratee', 'lodash/_baseRest', 'lodash/_baseUnary', 'lodash/_flatRest'], function (exports, _apply, _arrayMap, _baseIteratee, _baseRest, _baseUnary, _flatRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function like `_.over`.
   *
   * @private
   * @param {Function} arrayFunc The function to iterate over iteratees.
   * @returns {Function} Returns the new over function.
   */
  function createOver(arrayFunc) {
    return (0, _flatRest.default)(function (iteratees) {
      iteratees = (0, _arrayMap.default)(iteratees, (0, _baseUnary.default)(_baseIteratee.default));
      return (0, _baseRest.default)(function (args) {
        var thisArg = this;
        return arrayFunc(iteratees, function (iteratee) {
          return (0, _apply.default)(iteratee, thisArg, args);
        });
      });
    });
  }

  exports.default = createOver;
});