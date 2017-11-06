define('lodash/bindKey', ['exports', 'lodash/_baseRest', 'lodash/_createWrap', 'lodash/_getHolder', 'lodash/_replaceHolders'], function (exports, _baseRest, _createWrap, _getHolder, _replaceHolders) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_PARTIAL_FLAG = 32;

  /**
   * Creates a function that invokes the method at `object[key]` with `partials`
   * prepended to the arguments it receives.
   *
   * This method differs from `_.bind` by allowing bound functions to reference
   * methods that may be redefined or don't yet exist. See
   * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
   * for more details.
   *
   * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Function
   * @param {Object} object The object to invoke the method on.
   * @param {string} key The key of the method.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var object = {
   *   'user': 'fred',
   *   'greet': function(greeting, punctuation) {
   *     return greeting + ' ' + this.user + punctuation;
   *   }
   * };
   *
   * var bound = _.bindKey(object, 'greet', 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * object.greet = function(greeting, punctuation) {
   *   return greeting + 'ya ' + this.user + punctuation;
   * };
   *
   * bound('!');
   * // => 'hiya fred!'
   *
   * // Bound with placeholders.
   * var bound = _.bindKey(object, 'greet', _, '!');
   * bound('hi');
   * // => 'hiya fred!'
   */
  var bindKey = (0, _baseRest.default)(function (object, key, partials) {
    var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
    if (partials.length) {
      var holders = (0, _replaceHolders.default)(partials, (0, _getHolder.default)(bindKey));
      bitmask |= WRAP_PARTIAL_FLAG;
    }
    return (0, _createWrap.default)(key, bitmask, object, partials, holders);
  });

  // Assign default placeholders.
  bindKey.placeholder = {};

  exports.default = bindKey;
});