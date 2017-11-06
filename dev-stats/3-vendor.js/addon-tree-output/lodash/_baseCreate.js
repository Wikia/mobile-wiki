define('lodash/_baseCreate', ['exports', 'lodash/isObject'], function (exports, _isObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = function () {
    function object() {}
    return function (proto) {
      if (!(0, _isObject.default)(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = undefined;
      return result;
    };
  }();

  exports.default = baseCreate;
});