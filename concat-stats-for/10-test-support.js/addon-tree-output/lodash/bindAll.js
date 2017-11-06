define('lodash/bindAll', ['exports', 'lodash/_arrayEach', 'lodash/_baseAssignValue', 'lodash/bind', 'lodash/_flatRest', 'lodash/_toKey'], function (exports, _arrayEach, _baseAssignValue, _bind, _flatRest, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Binds methods of an object to the object itself, overwriting the existing
   * method.
   *
   * **Note:** This method doesn't set the "length" property of bound functions.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {Object} object The object to bind and assign the bound methods to.
   * @param {...(string|string[])} methodNames The object method names to bind.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var view = {
   *   'label': 'docs',
   *   'click': function() {
   *     console.log('clicked ' + this.label);
   *   }
   * };
   *
   * _.bindAll(view, ['click']);
   * jQuery(element).on('click', view.click);
   * // => Logs 'clicked docs' when clicked.
   */
  var bindAll = (0, _flatRest.default)(function (object, methodNames) {
    (0, _arrayEach.default)(methodNames, function (key) {
      key = (0, _toKey.default)(key);
      (0, _baseAssignValue.default)(object, key, (0, _bind.default)(object[key], object));
    });
    return object;
  });

  exports.default = bindAll;
});