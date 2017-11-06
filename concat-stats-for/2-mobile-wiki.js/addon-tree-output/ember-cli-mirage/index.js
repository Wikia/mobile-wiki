define('ember-cli-mirage/index', ['exports', 'ember-cli-mirage/factory', 'ember-cli-mirage/trait', 'ember-cli-mirage/association', 'ember-cli-mirage/response', 'ember-cli-mirage/faker', 'ember-cli-mirage/orm/model', 'ember-cli-mirage/orm/collection', 'ember-cli-mirage/serializer', 'ember-cli-mirage/serializers/active-model-serializer', 'ember-cli-mirage/serializers/json-api-serializer', 'ember-cli-mirage/serializers/rest-serializer', 'ember-cli-mirage/orm/associations/has-many', 'ember-cli-mirage/orm/associations/belongs-to', 'ember-cli-mirage/identity-manager'], function (exports, _emberCliMirageFactory, _emberCliMirageTrait, _emberCliMirageAssociation, _emberCliMirageResponse, _emberCliMirageFaker, _emberCliMirageOrmModel, _emberCliMirageOrmCollection, _emberCliMirageSerializer, _emberCliMirageSerializersActiveModelSerializer, _emberCliMirageSerializersJsonApiSerializer, _emberCliMirageSerializersRestSerializer, _emberCliMirageOrmAssociationsHasMany, _emberCliMirageOrmAssociationsBelongsTo, _emberCliMirageIdentityManager) {
  var _bind = Function.prototype.bind;

  function hasMany() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (_bind.apply(_emberCliMirageOrmAssociationsHasMany['default'], [null].concat(args)))();
  }
  function belongsTo() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new (_bind.apply(_emberCliMirageOrmAssociationsBelongsTo['default'], [null].concat(args)))();
  }

  exports.Factory = _emberCliMirageFactory['default'];
  exports.trait = _emberCliMirageTrait['default'];
  exports.association = _emberCliMirageAssociation['default'];
  exports.Response = _emberCliMirageResponse['default'];
  exports.faker = _emberCliMirageFaker['default'];
  exports.Model = _emberCliMirageOrmModel['default'];
  exports.Collection = _emberCliMirageOrmCollection['default'];
  exports.Serializer = _emberCliMirageSerializer['default'];
  exports.ActiveModelSerializer = _emberCliMirageSerializersActiveModelSerializer['default'];
  exports.JSONAPISerializer = _emberCliMirageSerializersJsonApiSerializer['default'];
  exports.RestSerializer = _emberCliMirageSerializersRestSerializer['default'];
  exports.hasMany = hasMany;
  exports.belongsTo = belongsTo;
  exports.IdentityManager = _emberCliMirageIdentityManager['default'];
  exports['default'] = {
    Factory: _emberCliMirageFactory['default'],
    Response: _emberCliMirageResponse['default'],
    hasMany: hasMany,
    belongsTo: belongsTo
  };
});