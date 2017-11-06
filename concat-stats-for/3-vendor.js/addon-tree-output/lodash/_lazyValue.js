define('lodash/_lazyValue', ['exports', 'lodash/_baseWrapperValue', 'lodash/_getView', 'lodash/isArray'], function (exports, _baseWrapperValue, _getView, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * Extracts the unwrapped value from its lazy wrapper.
   *
   * @private
   * @name value
   * @memberOf LazyWrapper
   * @returns {*} Returns the unwrapped value.
   */
  function lazyValue() {
    var array = this.__wrapped__.value(),
        dir = this.__dir__,
        isArr = (0, _isArray.default)(array),
        isRight = dir < 0,
        arrLength = isArr ? array.length : 0,
        view = (0, _getView.default)(0, arrLength, this.__views__),
        start = view.start,
        end = view.end,
        length = end - start,
        index = isRight ? end : start - 1,
        iteratees = this.__iteratees__,
        iterLength = iteratees.length,
        resIndex = 0,
        takeCount = nativeMin(length, this.__takeCount__);

    if (!isArr || !isRight && arrLength == length && takeCount == length) {
      return (0, _baseWrapperValue.default)(array, this.__actions__);
    }
    var result = [];

    outer: while (length-- && resIndex < takeCount) {
      index += dir;

      var iterIndex = -1,
          value = array[index];

      while (++iterIndex < iterLength) {
        var data = iteratees[iterIndex],
            iteratee = data.iteratee,
            type = data.type,
            computed = iteratee(value);

        if (type == LAZY_MAP_FLAG) {
          value = computed;
        } else if (!computed) {
          if (type == LAZY_FILTER_FLAG) {
            continue outer;
          } else {
            break outer;
          }
        }
      }
      result[resIndex++] = value;
    }
    return result;
  }

  exports.default = lazyValue;
});