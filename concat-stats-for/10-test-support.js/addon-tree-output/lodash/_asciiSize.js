define('lodash/_asciiSize', ['exports', 'lodash/_baseProperty'], function (exports, _baseProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = (0, _baseProperty.default)('length');

  exports.default = asciiSize;
});