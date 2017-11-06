define('ember-cli-mirage/utils/normalize-name', ['exports', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageUtilsInflector) {
  exports.toCollectionName = toCollectionName;
  exports.toModelName = toModelName;

  function toCollectionName(type) {
    var modelName = (0, _emberCliMirageUtilsInflector.dasherize)(type);
    return (0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.pluralize)(modelName));
  }

  function toModelName(type) {
    var modelName = (0, _emberCliMirageUtilsInflector.dasherize)(type);
    return (0, _emberCliMirageUtilsInflector.singularize)(modelName);
  }
});