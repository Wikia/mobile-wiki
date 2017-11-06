define('ember-cli-mirage/utils/ember-data', ['exports', 'lodash/find'], function (exports, _lodashFind) {
  exports.isDsModel = isDsModel;

  function _hasEmberData() {
    var matchRegex = /^ember-data/i;
    return !!(0, _lodashFind['default'])(Object.keys(requirejs.entries), function (e) {
      return !!e.match(matchRegex);
    });
  }

  var hasEmberData = _hasEmberData();

  exports.hasEmberData = hasEmberData;

  function isDsModel(m) {
    return m && typeof m.eachRelationship === 'function';
  }
});
/* global requirejs */