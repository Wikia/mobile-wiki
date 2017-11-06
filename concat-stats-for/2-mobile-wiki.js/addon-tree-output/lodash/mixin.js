define('lodash/mixin', ['exports', 'lodash/_arrayEach', 'lodash/_arrayPush', 'lodash/_baseFunctions', 'lodash/_copyArray', 'lodash/isFunction', 'lodash/isObject', 'lodash/keys'], function (exports, _arrayEach, _arrayPush, _baseFunctions, _copyArray, _isFunction, _isObject, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Adds all own enumerable string keyed function properties of a source
   * object to the destination object. If `object` is a function, then methods
   * are added to its prototype as well.
   *
   * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
   * avoid conflicts caused by modifying the original.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {Function|Object} [object=lodash] The destination object.
   * @param {Object} source The object of functions to add.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
   * @returns {Function|Object} Returns `object`.
   * @example
   *
   * function vowels(string) {
   *   return _.filter(string, function(v) {
   *     return /[aeiou]/i.test(v);
   *   });
   * }
   *
   * _.mixin({ 'vowels': vowels });
   * _.vowels('fred');
   * // => ['e']
   *
   * _('fred').vowels().value();
   * // => ['e']
   *
   * _.mixin({ 'vowels': vowels }, { 'chain': false });
   * _('fred').vowels();
   * // => ['e']
   */
  function mixin(object, source, options) {
    var props = (0, _keys.default)(source),
        methodNames = (0, _baseFunctions.default)(source, props);

    var chain = !((0, _isObject.default)(options) && 'chain' in options) || !!options.chain,
        isFunc = (0, _isFunction.default)(object);

    (0, _arrayEach.default)(methodNames, function (methodName) {
      var func = source[methodName];
      object[methodName] = func;
      if (isFunc) {
        object.prototype[methodName] = function () {
          var chainAll = this.__chain__;
          if (chain || chainAll) {
            var result = object(this.__wrapped__),
                actions = result.__actions__ = (0, _copyArray.default)(this.__actions__);

            actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
            result.__chain__ = chainAll;
            return result;
          }
          return func.apply(object, (0, _arrayPush.default)([this.value()], arguments));
        };
      }
    });

    return object;
  }

  exports.default = mixin;
});