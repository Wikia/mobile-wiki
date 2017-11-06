define('lodash/_cloneSet', ['exports', 'lodash/_addSetEntry', 'lodash/_arrayReduce', 'lodash/_setToArray'], function (exports, _addSetEntry, _arrayReduce, _setToArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1;

  /**
   * Creates a clone of `set`.
   *
   * @private
   * @param {Object} set The set to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned set.
   */
  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc((0, _setToArray.default)(set), CLONE_DEEP_FLAG) : (0, _setToArray.default)(set);
    return (0, _arrayReduce.default)(array, _addSetEntry.default, new set.constructor());
  }

  exports.default = cloneSet;
});