define('lodash/_createCompounder', ['exports', 'lodash/_arrayReduce', 'lodash/deburr', 'lodash/words'], function (exports, _arrayReduce, _deburr, _words) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose unicode capture groups. */
  var rsApos = '[\'\u2019]';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Creates a function like `_.camelCase`.
   *
   * @private
   * @param {Function} callback The function to combine each word.
   * @returns {Function} Returns the new compounder function.
   */
  function createCompounder(callback) {
    return function (string) {
      return (0, _arrayReduce.default)((0, _words.default)((0, _deburr.default)(string).replace(reApos, '')), callback, '');
    };
  }

  exports.default = createCompounder;
});