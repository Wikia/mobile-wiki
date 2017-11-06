define('ember-cli-mirage/serializers/active-model-serializer', ['exports', 'ember-cli-mirage/serializer', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageSerializer, _emberCliMirageUtilsInflector) {
  exports['default'] = _emberCliMirageSerializer['default'].extend({

    keyForModel: function keyForModel(type) {
      return (0, _emberCliMirageUtilsInflector.underscore)(type);
    },

    keyForAttribute: function keyForAttribute(attr) {
      return (0, _emberCliMirageUtilsInflector.underscore)(attr);
    },

    keyForRelationship: function keyForRelationship(type) {
      return (0, _emberCliMirageUtilsInflector.pluralize)((0, _emberCliMirageUtilsInflector.underscore)(type));
    },

    keyForEmbeddedRelationship: function keyForEmbeddedRelationship(attributeName) {
      return (0, _emberCliMirageUtilsInflector.underscore)(attributeName);
    },

    keyForRelationshipIds: function keyForRelationshipIds(type) {
      return (0, _emberCliMirageUtilsInflector.underscore)((0, _emberCliMirageUtilsInflector.singularize)(type)) + '_ids';
    },

    keyForForeignKey: function keyForForeignKey(relationshipName) {
      return (0, _emberCliMirageUtilsInflector.underscore)(relationshipName) + '_id';
    },

    keyForPolymorphicForeignKeyId: function keyForPolymorphicForeignKeyId(relationshipName) {
      return (0, _emberCliMirageUtilsInflector.underscore)(relationshipName) + '_id';
    },

    keyForPolymorphicForeignKeyType: function keyForPolymorphicForeignKeyType(relationshipName) {
      return (0, _emberCliMirageUtilsInflector.underscore)(relationshipName) + '_type';
    },

    normalize: function normalize(payload) {
      var type = Object.keys(payload)[0];
      var attrs = payload[type];

      var jsonApiPayload = {
        data: {
          type: (0, _emberCliMirageUtilsInflector.pluralize)(type),
          attributes: {}
        }
      };
      if (attrs.id) {
        jsonApiPayload.data.id = attrs.id;
      }
      Object.keys(attrs).forEach(function (key) {
        if (key !== 'id') {
          jsonApiPayload.data.attributes[(0, _emberCliMirageUtilsInflector.dasherize)(key)] = attrs[key];
        }
      });

      return jsonApiPayload;
    }

  });
});