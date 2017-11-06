define('lodash/_metaMap', ['exports', 'lodash/_WeakMap'], function (exports, _WeakMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to store function metadata. */
  var metaMap = _WeakMap.default && new _WeakMap.default();

  exports.default = metaMap;
});