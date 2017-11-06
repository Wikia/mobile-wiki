define('ember-cli-mirage/serializers/rest-serializer', ['exports', 'ember-cli-mirage/serializers/active-model-serializer', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageSerializersActiveModelSerializer, _emberCliMirageUtilsInflector) {
  exports['default'] = _emberCliMirageSerializersActiveModelSerializer['default'].extend({

    keyForModel: function keyForModel(type) {
      return (0, _emberCliMirageUtilsInflector.camelize)(type);
    },

    keyForAttribute: function keyForAttribute(attr) {
      return (0, _emberCliMirageUtilsInflector.camelize)(attr);
    },

    keyForRelationship: function keyForRelationship(type) {
      return (0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.pluralize)(type));
    },

    keyForEmbeddedRelationship: function keyForEmbeddedRelationship(attributeName) {
      return (0, _emberCliMirageUtilsInflector.camelize)(attributeName);
    },

    keyForRelationshipIds: function keyForRelationshipIds(type) {
      return (0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.pluralize)(type));
    },

    keyForForeignKey: function keyForForeignKey(relationshipName) {
      return (0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(relationshipName));
    }

  });
});