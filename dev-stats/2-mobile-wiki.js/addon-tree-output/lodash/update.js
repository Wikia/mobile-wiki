define('lodash/update', ['exports', 'lodash/_baseUpdate', 'lodash/_castFunction'], function (exports, _baseUpdate, _castFunction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.set` except that accepts `updater` to produce the
   * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
   * is invoked with one argument: (value).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.6.0
   * @category Object
   * @param {Object} object The object to modify.
   * @param {Array|string} path The path of the property to set.
   * @param {Function} updater The function to produce the updated value.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.update(object, 'a[0].b.c', function(n) { return n * n; });
   * console.log(object.a[0].b.c);
   * // => 9
   *
   * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
   * console.log(object.x[0].y.z);
   * // => 0
   */
  function update(object, path, updater) {
    return object == null ? object : (0, _baseUpdate.default)(object, path, (0, _castFunction.default)(updater));
  }

  exports.default = update;
});