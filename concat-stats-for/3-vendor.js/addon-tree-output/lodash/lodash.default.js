define('lodash/lodash.default', ['exports', 'lodash/array', 'lodash/collection', 'lodash/date', 'lodash/function', 'lodash/lang', 'lodash/math', 'lodash/number', 'lodash/object', 'lodash/seq', 'lodash/string', 'lodash/util', 'lodash/_LazyWrapper', 'lodash/_LodashWrapper', 'lodash/_Symbol', 'lodash/_arrayEach', 'lodash/_arrayPush', 'lodash/_baseForOwn', 'lodash/_baseFunctions', 'lodash/_baseInvoke', 'lodash/_baseIteratee', 'lodash/_baseRest', 'lodash/_createHybrid', 'lodash/identity', 'lodash/isArray', 'lodash/isObject', 'lodash/keys', 'lodash/last', 'lodash/_lazyClone', 'lodash/_lazyReverse', 'lodash/_lazyValue', 'lodash/mixin', 'lodash/negate', 'lodash/_realNames', 'lodash/thru', 'lodash/toInteger', 'lodash/wrapperLodash'], function (exports, _array, _collection, _date, _function, _lang, _math, _number, _object, _seq, _string, _util, _LazyWrapper, _LodashWrapper, _Symbol2, _arrayEach, _arrayPush, _baseForOwn, _baseFunctions, _baseInvoke, _baseIteratee, _baseRest, _createHybrid, _identity, _isArray, _isObject, _keys, _last, _lazyClone, _lazyReverse, _lazyValue, _mixin2, _negate, _realNames, _thru, _toInteger, _wrapperLodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as the semantic version number. */
  /**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright JS Foundation and other contributors <https://js.foundation/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  var VERSION = '4.17.4';

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_KEY_FLAG = 2;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Built-in value references. */
  var symIterator = _Symbol2.default ? _Symbol2.default.iterator : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  // wrap `_.mixin` so it works when provided only one argument
  var mixin = function (func) {
    return function (object, source, options) {
      if (options == null) {
        var isObj = (0, _isObject.default)(source),
            props = isObj && (0, _keys.default)(source),
            methodNames = props && props.length && (0, _baseFunctions.default)(source, props);

        if (!(methodNames ? methodNames.length : isObj)) {
          options = source;
          source = object;
          object = this;
        }
      }
      return func(object, source, options);
    };
  }(_mixin2.default);

  // Add methods that return wrapped values in chain sequences.
  _wrapperLodash.default.after = _function.default.after;
  _wrapperLodash.default.ary = _function.default.ary;
  _wrapperLodash.default.assign = _object.default.assign;
  _wrapperLodash.default.assignIn = _object.default.assignIn;
  _wrapperLodash.default.assignInWith = _object.default.assignInWith;
  _wrapperLodash.default.assignWith = _object.default.assignWith;
  _wrapperLodash.default.at = _object.default.at;
  _wrapperLodash.default.before = _function.default.before;
  _wrapperLodash.default.bind = _function.default.bind;
  _wrapperLodash.default.bindAll = _util.default.bindAll;
  _wrapperLodash.default.bindKey = _function.default.bindKey;
  _wrapperLodash.default.castArray = _lang.default.castArray;
  _wrapperLodash.default.chain = _seq.default.chain;
  _wrapperLodash.default.chunk = _array.default.chunk;
  _wrapperLodash.default.compact = _array.default.compact;
  _wrapperLodash.default.concat = _array.default.concat;
  _wrapperLodash.default.cond = _util.default.cond;
  _wrapperLodash.default.conforms = _util.default.conforms;
  _wrapperLodash.default.constant = _util.default.constant;
  _wrapperLodash.default.countBy = _collection.default.countBy;
  _wrapperLodash.default.create = _object.default.create;
  _wrapperLodash.default.curry = _function.default.curry;
  _wrapperLodash.default.curryRight = _function.default.curryRight;
  _wrapperLodash.default.debounce = _function.default.debounce;
  _wrapperLodash.default.defaults = _object.default.defaults;
  _wrapperLodash.default.defaultsDeep = _object.default.defaultsDeep;
  _wrapperLodash.default.defer = _function.default.defer;
  _wrapperLodash.default.delay = _function.default.delay;
  _wrapperLodash.default.difference = _array.default.difference;
  _wrapperLodash.default.differenceBy = _array.default.differenceBy;
  _wrapperLodash.default.differenceWith = _array.default.differenceWith;
  _wrapperLodash.default.drop = _array.default.drop;
  _wrapperLodash.default.dropRight = _array.default.dropRight;
  _wrapperLodash.default.dropRightWhile = _array.default.dropRightWhile;
  _wrapperLodash.default.dropWhile = _array.default.dropWhile;
  _wrapperLodash.default.fill = _array.default.fill;
  _wrapperLodash.default.filter = _collection.default.filter;
  _wrapperLodash.default.flatMap = _collection.default.flatMap;
  _wrapperLodash.default.flatMapDeep = _collection.default.flatMapDeep;
  _wrapperLodash.default.flatMapDepth = _collection.default.flatMapDepth;
  _wrapperLodash.default.flatten = _array.default.flatten;
  _wrapperLodash.default.flattenDeep = _array.default.flattenDeep;
  _wrapperLodash.default.flattenDepth = _array.default.flattenDepth;
  _wrapperLodash.default.flip = _function.default.flip;
  _wrapperLodash.default.flow = _util.default.flow;
  _wrapperLodash.default.flowRight = _util.default.flowRight;
  _wrapperLodash.default.fromPairs = _array.default.fromPairs;
  _wrapperLodash.default.functions = _object.default.functions;
  _wrapperLodash.default.functionsIn = _object.default.functionsIn;
  _wrapperLodash.default.groupBy = _collection.default.groupBy;
  _wrapperLodash.default.initial = _array.default.initial;
  _wrapperLodash.default.intersection = _array.default.intersection;
  _wrapperLodash.default.intersectionBy = _array.default.intersectionBy;
  _wrapperLodash.default.intersectionWith = _array.default.intersectionWith;
  _wrapperLodash.default.invert = _object.default.invert;
  _wrapperLodash.default.invertBy = _object.default.invertBy;
  _wrapperLodash.default.invokeMap = _collection.default.invokeMap;
  _wrapperLodash.default.iteratee = _util.default.iteratee;
  _wrapperLodash.default.keyBy = _collection.default.keyBy;
  _wrapperLodash.default.keys = _keys.default;
  _wrapperLodash.default.keysIn = _object.default.keysIn;
  _wrapperLodash.default.map = _collection.default.map;
  _wrapperLodash.default.mapKeys = _object.default.mapKeys;
  _wrapperLodash.default.mapValues = _object.default.mapValues;
  _wrapperLodash.default.matches = _util.default.matches;
  _wrapperLodash.default.matchesProperty = _util.default.matchesProperty;
  _wrapperLodash.default.memoize = _function.default.memoize;
  _wrapperLodash.default.merge = _object.default.merge;
  _wrapperLodash.default.mergeWith = _object.default.mergeWith;
  _wrapperLodash.default.method = _util.default.method;
  _wrapperLodash.default.methodOf = _util.default.methodOf;
  _wrapperLodash.default.mixin = mixin;
  _wrapperLodash.default.negate = _negate.default;
  _wrapperLodash.default.nthArg = _util.default.nthArg;
  _wrapperLodash.default.omit = _object.default.omit;
  _wrapperLodash.default.omitBy = _object.default.omitBy;
  _wrapperLodash.default.once = _function.default.once;
  _wrapperLodash.default.orderBy = _collection.default.orderBy;
  _wrapperLodash.default.over = _util.default.over;
  _wrapperLodash.default.overArgs = _function.default.overArgs;
  _wrapperLodash.default.overEvery = _util.default.overEvery;
  _wrapperLodash.default.overSome = _util.default.overSome;
  _wrapperLodash.default.partial = _function.default.partial;
  _wrapperLodash.default.partialRight = _function.default.partialRight;
  _wrapperLodash.default.partition = _collection.default.partition;
  _wrapperLodash.default.pick = _object.default.pick;
  _wrapperLodash.default.pickBy = _object.default.pickBy;
  _wrapperLodash.default.property = _util.default.property;
  _wrapperLodash.default.propertyOf = _util.default.propertyOf;
  _wrapperLodash.default.pull = _array.default.pull;
  _wrapperLodash.default.pullAll = _array.default.pullAll;
  _wrapperLodash.default.pullAllBy = _array.default.pullAllBy;
  _wrapperLodash.default.pullAllWith = _array.default.pullAllWith;
  _wrapperLodash.default.pullAt = _array.default.pullAt;
  _wrapperLodash.default.range = _util.default.range;
  _wrapperLodash.default.rangeRight = _util.default.rangeRight;
  _wrapperLodash.default.rearg = _function.default.rearg;
  _wrapperLodash.default.reject = _collection.default.reject;
  _wrapperLodash.default.remove = _array.default.remove;
  _wrapperLodash.default.rest = _function.default.rest;
  _wrapperLodash.default.reverse = _array.default.reverse;
  _wrapperLodash.default.sampleSize = _collection.default.sampleSize;
  _wrapperLodash.default.set = _object.default.set;
  _wrapperLodash.default.setWith = _object.default.setWith;
  _wrapperLodash.default.shuffle = _collection.default.shuffle;
  _wrapperLodash.default.slice = _array.default.slice;
  _wrapperLodash.default.sortBy = _collection.default.sortBy;
  _wrapperLodash.default.sortedUniq = _array.default.sortedUniq;
  _wrapperLodash.default.sortedUniqBy = _array.default.sortedUniqBy;
  _wrapperLodash.default.split = _string.default.split;
  _wrapperLodash.default.spread = _function.default.spread;
  _wrapperLodash.default.tail = _array.default.tail;
  _wrapperLodash.default.take = _array.default.take;
  _wrapperLodash.default.takeRight = _array.default.takeRight;
  _wrapperLodash.default.takeRightWhile = _array.default.takeRightWhile;
  _wrapperLodash.default.takeWhile = _array.default.takeWhile;
  _wrapperLodash.default.tap = _seq.default.tap;
  _wrapperLodash.default.throttle = _function.default.throttle;
  _wrapperLodash.default.thru = _thru.default;
  _wrapperLodash.default.toArray = _lang.default.toArray;
  _wrapperLodash.default.toPairs = _object.default.toPairs;
  _wrapperLodash.default.toPairsIn = _object.default.toPairsIn;
  _wrapperLodash.default.toPath = _util.default.toPath;
  _wrapperLodash.default.toPlainObject = _lang.default.toPlainObject;
  _wrapperLodash.default.transform = _object.default.transform;
  _wrapperLodash.default.unary = _function.default.unary;
  _wrapperLodash.default.union = _array.default.union;
  _wrapperLodash.default.unionBy = _array.default.unionBy;
  _wrapperLodash.default.unionWith = _array.default.unionWith;
  _wrapperLodash.default.uniq = _array.default.uniq;
  _wrapperLodash.default.uniqBy = _array.default.uniqBy;
  _wrapperLodash.default.uniqWith = _array.default.uniqWith;
  _wrapperLodash.default.unset = _object.default.unset;
  _wrapperLodash.default.unzip = _array.default.unzip;
  _wrapperLodash.default.unzipWith = _array.default.unzipWith;
  _wrapperLodash.default.update = _object.default.update;
  _wrapperLodash.default.updateWith = _object.default.updateWith;
  _wrapperLodash.default.values = _object.default.values;
  _wrapperLodash.default.valuesIn = _object.default.valuesIn;
  _wrapperLodash.default.without = _array.default.without;
  _wrapperLodash.default.words = _string.default.words;
  _wrapperLodash.default.wrap = _function.default.wrap;
  _wrapperLodash.default.xor = _array.default.xor;
  _wrapperLodash.default.xorBy = _array.default.xorBy;
  _wrapperLodash.default.xorWith = _array.default.xorWith;
  _wrapperLodash.default.zip = _array.default.zip;
  _wrapperLodash.default.zipObject = _array.default.zipObject;
  _wrapperLodash.default.zipObjectDeep = _array.default.zipObjectDeep;
  _wrapperLodash.default.zipWith = _array.default.zipWith;

  // Add aliases.
  _wrapperLodash.default.entries = _object.default.toPairs;
  _wrapperLodash.default.entriesIn = _object.default.toPairsIn;
  _wrapperLodash.default.extend = _object.default.assignIn;
  _wrapperLodash.default.extendWith = _object.default.assignInWith;

  // Add methods to `lodash.prototype`.
  mixin(_wrapperLodash.default, _wrapperLodash.default);

  // Add methods that return unwrapped values in chain sequences.
  _wrapperLodash.default.add = _math.default.add;
  _wrapperLodash.default.attempt = _util.default.attempt;
  _wrapperLodash.default.camelCase = _string.default.camelCase;
  _wrapperLodash.default.capitalize = _string.default.capitalize;
  _wrapperLodash.default.ceil = _math.default.ceil;
  _wrapperLodash.default.clamp = _number.default.clamp;
  _wrapperLodash.default.clone = _lang.default.clone;
  _wrapperLodash.default.cloneDeep = _lang.default.cloneDeep;
  _wrapperLodash.default.cloneDeepWith = _lang.default.cloneDeepWith;
  _wrapperLodash.default.cloneWith = _lang.default.cloneWith;
  _wrapperLodash.default.conformsTo = _lang.default.conformsTo;
  _wrapperLodash.default.deburr = _string.default.deburr;
  _wrapperLodash.default.defaultTo = _util.default.defaultTo;
  _wrapperLodash.default.divide = _math.default.divide;
  _wrapperLodash.default.endsWith = _string.default.endsWith;
  _wrapperLodash.default.eq = _lang.default.eq;
  _wrapperLodash.default.escape = _string.default.escape;
  _wrapperLodash.default.escapeRegExp = _string.default.escapeRegExp;
  _wrapperLodash.default.every = _collection.default.every;
  _wrapperLodash.default.find = _collection.default.find;
  _wrapperLodash.default.findIndex = _array.default.findIndex;
  _wrapperLodash.default.findKey = _object.default.findKey;
  _wrapperLodash.default.findLast = _collection.default.findLast;
  _wrapperLodash.default.findLastIndex = _array.default.findLastIndex;
  _wrapperLodash.default.findLastKey = _object.default.findLastKey;
  _wrapperLodash.default.floor = _math.default.floor;
  _wrapperLodash.default.forEach = _collection.default.forEach;
  _wrapperLodash.default.forEachRight = _collection.default.forEachRight;
  _wrapperLodash.default.forIn = _object.default.forIn;
  _wrapperLodash.default.forInRight = _object.default.forInRight;
  _wrapperLodash.default.forOwn = _object.default.forOwn;
  _wrapperLodash.default.forOwnRight = _object.default.forOwnRight;
  _wrapperLodash.default.get = _object.default.get;
  _wrapperLodash.default.gt = _lang.default.gt;
  _wrapperLodash.default.gte = _lang.default.gte;
  _wrapperLodash.default.has = _object.default.has;
  _wrapperLodash.default.hasIn = _object.default.hasIn;
  _wrapperLodash.default.head = _array.default.head;
  _wrapperLodash.default.identity = _identity.default;
  _wrapperLodash.default.includes = _collection.default.includes;
  _wrapperLodash.default.indexOf = _array.default.indexOf;
  _wrapperLodash.default.inRange = _number.default.inRange;
  _wrapperLodash.default.invoke = _object.default.invoke;
  _wrapperLodash.default.isArguments = _lang.default.isArguments;
  _wrapperLodash.default.isArray = _isArray.default;
  _wrapperLodash.default.isArrayBuffer = _lang.default.isArrayBuffer;
  _wrapperLodash.default.isArrayLike = _lang.default.isArrayLike;
  _wrapperLodash.default.isArrayLikeObject = _lang.default.isArrayLikeObject;
  _wrapperLodash.default.isBoolean = _lang.default.isBoolean;
  _wrapperLodash.default.isBuffer = _lang.default.isBuffer;
  _wrapperLodash.default.isDate = _lang.default.isDate;
  _wrapperLodash.default.isElement = _lang.default.isElement;
  _wrapperLodash.default.isEmpty = _lang.default.isEmpty;
  _wrapperLodash.default.isEqual = _lang.default.isEqual;
  _wrapperLodash.default.isEqualWith = _lang.default.isEqualWith;
  _wrapperLodash.default.isError = _lang.default.isError;
  _wrapperLodash.default.isFinite = _lang.default.isFinite;
  _wrapperLodash.default.isFunction = _lang.default.isFunction;
  _wrapperLodash.default.isInteger = _lang.default.isInteger;
  _wrapperLodash.default.isLength = _lang.default.isLength;
  _wrapperLodash.default.isMap = _lang.default.isMap;
  _wrapperLodash.default.isMatch = _lang.default.isMatch;
  _wrapperLodash.default.isMatchWith = _lang.default.isMatchWith;
  _wrapperLodash.default.isNaN = _lang.default.isNaN;
  _wrapperLodash.default.isNative = _lang.default.isNative;
  _wrapperLodash.default.isNil = _lang.default.isNil;
  _wrapperLodash.default.isNull = _lang.default.isNull;
  _wrapperLodash.default.isNumber = _lang.default.isNumber;
  _wrapperLodash.default.isObject = _isObject.default;
  _wrapperLodash.default.isObjectLike = _lang.default.isObjectLike;
  _wrapperLodash.default.isPlainObject = _lang.default.isPlainObject;
  _wrapperLodash.default.isRegExp = _lang.default.isRegExp;
  _wrapperLodash.default.isSafeInteger = _lang.default.isSafeInteger;
  _wrapperLodash.default.isSet = _lang.default.isSet;
  _wrapperLodash.default.isString = _lang.default.isString;
  _wrapperLodash.default.isSymbol = _lang.default.isSymbol;
  _wrapperLodash.default.isTypedArray = _lang.default.isTypedArray;
  _wrapperLodash.default.isUndefined = _lang.default.isUndefined;
  _wrapperLodash.default.isWeakMap = _lang.default.isWeakMap;
  _wrapperLodash.default.isWeakSet = _lang.default.isWeakSet;
  _wrapperLodash.default.join = _array.default.join;
  _wrapperLodash.default.kebabCase = _string.default.kebabCase;
  _wrapperLodash.default.last = _last.default;
  _wrapperLodash.default.lastIndexOf = _array.default.lastIndexOf;
  _wrapperLodash.default.lowerCase = _string.default.lowerCase;
  _wrapperLodash.default.lowerFirst = _string.default.lowerFirst;
  _wrapperLodash.default.lt = _lang.default.lt;
  _wrapperLodash.default.lte = _lang.default.lte;
  _wrapperLodash.default.max = _math.default.max;
  _wrapperLodash.default.maxBy = _math.default.maxBy;
  _wrapperLodash.default.mean = _math.default.mean;
  _wrapperLodash.default.meanBy = _math.default.meanBy;
  _wrapperLodash.default.min = _math.default.min;
  _wrapperLodash.default.minBy = _math.default.minBy;
  _wrapperLodash.default.stubArray = _util.default.stubArray;
  _wrapperLodash.default.stubFalse = _util.default.stubFalse;
  _wrapperLodash.default.stubObject = _util.default.stubObject;
  _wrapperLodash.default.stubString = _util.default.stubString;
  _wrapperLodash.default.stubTrue = _util.default.stubTrue;
  _wrapperLodash.default.multiply = _math.default.multiply;
  _wrapperLodash.default.nth = _array.default.nth;
  _wrapperLodash.default.noop = _util.default.noop;
  _wrapperLodash.default.now = _date.default.now;
  _wrapperLodash.default.pad = _string.default.pad;
  _wrapperLodash.default.padEnd = _string.default.padEnd;
  _wrapperLodash.default.padStart = _string.default.padStart;
  _wrapperLodash.default.parseInt = _string.default.parseInt;
  _wrapperLodash.default.random = _number.default.random;
  _wrapperLodash.default.reduce = _collection.default.reduce;
  _wrapperLodash.default.reduceRight = _collection.default.reduceRight;
  _wrapperLodash.default.repeat = _string.default.repeat;
  _wrapperLodash.default.replace = _string.default.replace;
  _wrapperLodash.default.result = _object.default.result;
  _wrapperLodash.default.round = _math.default.round;
  _wrapperLodash.default.sample = _collection.default.sample;
  _wrapperLodash.default.size = _collection.default.size;
  _wrapperLodash.default.snakeCase = _string.default.snakeCase;
  _wrapperLodash.default.some = _collection.default.some;
  _wrapperLodash.default.sortedIndex = _array.default.sortedIndex;
  _wrapperLodash.default.sortedIndexBy = _array.default.sortedIndexBy;
  _wrapperLodash.default.sortedIndexOf = _array.default.sortedIndexOf;
  _wrapperLodash.default.sortedLastIndex = _array.default.sortedLastIndex;
  _wrapperLodash.default.sortedLastIndexBy = _array.default.sortedLastIndexBy;
  _wrapperLodash.default.sortedLastIndexOf = _array.default.sortedLastIndexOf;
  _wrapperLodash.default.startCase = _string.default.startCase;
  _wrapperLodash.default.startsWith = _string.default.startsWith;
  _wrapperLodash.default.subtract = _math.default.subtract;
  _wrapperLodash.default.sum = _math.default.sum;
  _wrapperLodash.default.sumBy = _math.default.sumBy;
  _wrapperLodash.default.template = _string.default.template;
  _wrapperLodash.default.times = _util.default.times;
  _wrapperLodash.default.toFinite = _lang.default.toFinite;
  _wrapperLodash.default.toInteger = _toInteger.default;
  _wrapperLodash.default.toLength = _lang.default.toLength;
  _wrapperLodash.default.toLower = _string.default.toLower;
  _wrapperLodash.default.toNumber = _lang.default.toNumber;
  _wrapperLodash.default.toSafeInteger = _lang.default.toSafeInteger;
  _wrapperLodash.default.toString = _lang.default.toString;
  _wrapperLodash.default.toUpper = _string.default.toUpper;
  _wrapperLodash.default.trim = _string.default.trim;
  _wrapperLodash.default.trimEnd = _string.default.trimEnd;
  _wrapperLodash.default.trimStart = _string.default.trimStart;
  _wrapperLodash.default.truncate = _string.default.truncate;
  _wrapperLodash.default.unescape = _string.default.unescape;
  _wrapperLodash.default.uniqueId = _util.default.uniqueId;
  _wrapperLodash.default.upperCase = _string.default.upperCase;
  _wrapperLodash.default.upperFirst = _string.default.upperFirst;

  // Add aliases.
  _wrapperLodash.default.each = _collection.default.forEach;
  _wrapperLodash.default.eachRight = _collection.default.forEachRight;
  _wrapperLodash.default.first = _array.default.head;

  mixin(_wrapperLodash.default, function () {
    var source = {};
    (0, _baseForOwn.default)(_wrapperLodash.default, function (func, methodName) {
      if (!hasOwnProperty.call(_wrapperLodash.default.prototype, methodName)) {
        source[methodName] = func;
      }
    });
    return source;
  }(), { 'chain': false });

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type {string}
   */
  _wrapperLodash.default.VERSION = VERSION;
  (_wrapperLodash.default.templateSettings = _string.default.templateSettings).imports._ = _wrapperLodash.default;

  // Assign default placeholders.
  (0, _arrayEach.default)(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (methodName) {
    _wrapperLodash.default[methodName].placeholder = _wrapperLodash.default;
  });

  // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
  (0, _arrayEach.default)(['drop', 'take'], function (methodName, index) {
    _LazyWrapper.default.prototype[methodName] = function (n) {
      n = n === undefined ? 1 : nativeMax((0, _toInteger.default)(n), 0);

      var result = this.__filtered__ && !index ? new _LazyWrapper.default(this) : this.clone();

      if (result.__filtered__) {
        result.__takeCount__ = nativeMin(n, result.__takeCount__);
      } else {
        result.__views__.push({
          'size': nativeMin(n, MAX_ARRAY_LENGTH),
          'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
        });
      }
      return result;
    };

    _LazyWrapper.default.prototype[methodName + 'Right'] = function (n) {
      return this.reverse()[methodName](n).reverse();
    };
  });

  // Add `LazyWrapper` methods that accept an `iteratee` value.
  (0, _arrayEach.default)(['filter', 'map', 'takeWhile'], function (methodName, index) {
    var type = index + 1,
        isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

    _LazyWrapper.default.prototype[methodName] = function (iteratee) {
      var result = this.clone();
      result.__iteratees__.push({
        'iteratee': (0, _baseIteratee.default)(iteratee, 3),
        'type': type
      });
      result.__filtered__ = result.__filtered__ || isFilter;
      return result;
    };
  });

  // Add `LazyWrapper` methods for `_.head` and `_.last`.
  (0, _arrayEach.default)(['head', 'last'], function (methodName, index) {
    var takeName = 'take' + (index ? 'Right' : '');

    _LazyWrapper.default.prototype[methodName] = function () {
      return this[takeName](1).value()[0];
    };
  });

  // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
  (0, _arrayEach.default)(['initial', 'tail'], function (methodName, index) {
    var dropName = 'drop' + (index ? '' : 'Right');

    _LazyWrapper.default.prototype[methodName] = function () {
      return this.__filtered__ ? new _LazyWrapper.default(this) : this[dropName](1);
    };
  });

  _LazyWrapper.default.prototype.compact = function () {
    return this.filter(_identity.default);
  };

  _LazyWrapper.default.prototype.find = function (predicate) {
    return this.filter(predicate).head();
  };

  _LazyWrapper.default.prototype.findLast = function (predicate) {
    return this.reverse().find(predicate);
  };

  _LazyWrapper.default.prototype.invokeMap = (0, _baseRest.default)(function (path, args) {
    if (typeof path == 'function') {
      return new _LazyWrapper.default(this);
    }
    return this.map(function (value) {
      return (0, _baseInvoke.default)(value, path, args);
    });
  });

  _LazyWrapper.default.prototype.reject = function (predicate) {
    return this.filter((0, _negate.default)((0, _baseIteratee.default)(predicate)));
  };

  _LazyWrapper.default.prototype.slice = function (start, end) {
    start = (0, _toInteger.default)(start);

    var result = this;
    if (result.__filtered__ && (start > 0 || end < 0)) {
      return new _LazyWrapper.default(result);
    }
    if (start < 0) {
      result = result.takeRight(-start);
    } else if (start) {
      result = result.drop(start);
    }
    if (end !== undefined) {
      end = (0, _toInteger.default)(end);
      result = end < 0 ? result.dropRight(-end) : result.take(end - start);
    }
    return result;
  };

  _LazyWrapper.default.prototype.takeRightWhile = function (predicate) {
    return this.reverse().takeWhile(predicate).reverse();
  };

  _LazyWrapper.default.prototype.toArray = function () {
    return this.take(MAX_ARRAY_LENGTH);
  };

  // Add `LazyWrapper` methods to `lodash.prototype`.
  (0, _baseForOwn.default)(_LazyWrapper.default.prototype, function (func, methodName) {
    var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
        isTaker = /^(?:head|last)$/.test(methodName),
        lodashFunc = _wrapperLodash.default[isTaker ? 'take' + (methodName == 'last' ? 'Right' : '') : methodName],
        retUnwrapped = isTaker || /^find/.test(methodName);

    if (!lodashFunc) {
      return;
    }
    _wrapperLodash.default.prototype[methodName] = function () {
      var value = this.__wrapped__,
          args = isTaker ? [1] : arguments,
          isLazy = value instanceof _LazyWrapper.default,
          iteratee = args[0],
          useLazy = isLazy || (0, _isArray.default)(value);

      var interceptor = function interceptor(value) {
        var result = lodashFunc.apply(_wrapperLodash.default, (0, _arrayPush.default)([value], args));
        return isTaker && chainAll ? result[0] : result;
      };

      if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
        // Avoid lazy use if the iteratee has a "length" value other than `1`.
        isLazy = useLazy = false;
      }
      var chainAll = this.__chain__,
          isHybrid = !!this.__actions__.length,
          isUnwrapped = retUnwrapped && !chainAll,
          onlyLazy = isLazy && !isHybrid;

      if (!retUnwrapped && useLazy) {
        value = onlyLazy ? value : new _LazyWrapper.default(this);
        var result = func.apply(value, args);
        result.__actions__.push({ 'func': _thru.default, 'args': [interceptor], 'thisArg': undefined });
        return new _LodashWrapper.default(result, chainAll);
      }
      if (isUnwrapped && onlyLazy) {
        return func.apply(this, args);
      }
      result = this.thru(interceptor);
      return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
    };
  });

  // Add `Array` methods to `lodash.prototype`.
  (0, _arrayEach.default)(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (methodName) {
    var func = arrayProto[methodName],
        chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
        retUnwrapped = /^(?:pop|shift)$/.test(methodName);

    _wrapperLodash.default.prototype[methodName] = function () {
      var args = arguments;
      if (retUnwrapped && !this.__chain__) {
        var value = this.value();
        return func.apply((0, _isArray.default)(value) ? value : [], args);
      }
      return this[chainName](function (value) {
        return func.apply((0, _isArray.default)(value) ? value : [], args);
      });
    };
  });

  // Map minified method names to their real names.
  (0, _baseForOwn.default)(_LazyWrapper.default.prototype, function (func, methodName) {
    var lodashFunc = _wrapperLodash.default[methodName];
    if (lodashFunc) {
      var key = lodashFunc.name + '',
          names = _realNames.default[key] || (_realNames.default[key] = []);

      names.push({ 'name': methodName, 'func': lodashFunc });
    }
  });

  _realNames.default[(0, _createHybrid.default)(undefined, WRAP_BIND_KEY_FLAG).name] = [{
    'name': 'wrapper',
    'func': undefined
  }];

  // Add methods to `LazyWrapper`.
  _LazyWrapper.default.prototype.clone = _lazyClone.default;
  _LazyWrapper.default.prototype.reverse = _lazyReverse.default;
  _LazyWrapper.default.prototype.value = _lazyValue.default;

  // Add chain sequence methods to the `lodash` wrapper.
  _wrapperLodash.default.prototype.at = _seq.default.at;
  _wrapperLodash.default.prototype.chain = _seq.default.wrapperChain;
  _wrapperLodash.default.prototype.commit = _seq.default.commit;
  _wrapperLodash.default.prototype.next = _seq.default.next;
  _wrapperLodash.default.prototype.plant = _seq.default.plant;
  _wrapperLodash.default.prototype.reverse = _seq.default.reverse;
  _wrapperLodash.default.prototype.toJSON = _wrapperLodash.default.prototype.valueOf = _wrapperLodash.default.prototype.value = _seq.default.value;

  // Add lazy aliases.
  _wrapperLodash.default.prototype.first = _wrapperLodash.default.prototype.head;

  if (symIterator) {
    _wrapperLodash.default.prototype[symIterator] = _seq.default.toIterator;
  }

  exports.default = _wrapperLodash.default;
});