define('lodash/assign', ['exports', 'lodash/_assignValue', 'lodash/_copyObject', 'lodash/_createAssigner', 'lodash/isArrayLike', 'lodash/_isPrototype', 'lodash/keys'], function (exports, _assignValue, _copyObject, _createAssigner, _isArrayLike, _isPrototype, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Assigns own enumerable string keyed properties of source objects to the
   * destination object. Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assignIn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assign({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3 }
   */
  var assign = (0, _createAssigner.default)(function (object, source) {
    if ((0, _isPrototype.default)(source) || (0, _isArrayLike.default)(source)) {
      (0, _copyObject.default)(source, (0, _keys.default)(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        (0, _assignValue.default)(object, key, source[key]);
      }
    }
  });

  exports.default = assign;
});