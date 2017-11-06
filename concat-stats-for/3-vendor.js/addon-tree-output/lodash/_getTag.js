define('lodash/_getTag', ['exports', 'lodash/_DataView', 'lodash/_Map', 'lodash/_Promise', 'lodash/_Set', 'lodash/_WeakMap', 'lodash/_baseGetTag', 'lodash/_toSource'], function (exports, _DataView, _Map, _Promise, _Set, _WeakMap, _baseGetTag, _toSource) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    /** `Object#toString` result references. */
    var mapTag = '[object Map]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        setTag = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = (0, _toSource.default)(_DataView.default),
        mapCtorString = (0, _toSource.default)(_Map.default),
        promiseCtorString = (0, _toSource.default)(_Promise.default),
        setCtorString = (0, _toSource.default)(_Set.default),
        weakMapCtorString = (0, _toSource.default)(_WeakMap.default);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag.default;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node < 6.
    if (_DataView.default && getTag(new _DataView.default(new ArrayBuffer(1))) != dataViewTag || _Map.default && getTag(new _Map.default()) != mapTag || _Promise.default && getTag(_Promise.default.resolve()) != promiseTag || _Set.default && getTag(new _Set.default()) != setTag || _WeakMap.default && getTag(new _WeakMap.default()) != weakMapTag) {
        getTag = function getTag(value) {
            var result = (0, _baseGetTag.default)(value),
                Ctor = result == objectTag ? value.constructor : undefined,
                ctorString = Ctor ? (0, _toSource.default)(Ctor) : '';

            if (ctorString) {
                switch (ctorString) {
                    case dataViewCtorString:
                        return dataViewTag;
                    case mapCtorString:
                        return mapTag;
                    case promiseCtorString:
                        return promiseTag;
                    case setCtorString:
                        return setTag;
                    case weakMapCtorString:
                        return weakMapTag;
                }
            }
            return result;
        };
    }

    exports.default = getTag;
});