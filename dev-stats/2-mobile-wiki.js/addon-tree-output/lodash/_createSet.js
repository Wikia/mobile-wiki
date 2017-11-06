define('lodash/_createSet', ['exports', 'lodash/_Set', 'lodash/noop', 'lodash/_setToArray'], function (exports, _Set, _noop, _setToArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /**
   * Creates a set object of `values`.
   *
   * @private
   * @param {Array} values The values to add to the set.
   * @returns {Object} Returns the new set.
   */
  var createSet = !(_Set.default && 1 / (0, _setToArray.default)(new _Set.default([, -0]))[1] == INFINITY) ? _noop.default : function (values) {
    return new _Set.default(values);
  };

  exports.default = createSet;
});