define('lodash/_castRest', ['exports', 'lodash/_baseRest'], function (exports, _baseRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A `baseRest` alias which can be replaced with `identity` by module
   * replacement plugins.
   *
   * @private
   * @type {Function}
   * @param {Function} func The function to apply a rest parameter to.
   * @returns {Function} Returns the new function.
   */
  var castRest = _baseRest.default;

  exports.default = castRest;
});