define('ember-cli-mirage/serializers/json-api-serializer', ['exports', 'ember-cli-mirage/serializer', 'ember-cli-mirage/utils/inflector', 'lodash/get', 'lodash'], function (exports, _emberCliMirageSerializer, _emberCliMirageUtilsInflector, _lodashGet, _lodash) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _emberCliMirageSerializer['default'].extend({

    keyForModel: function keyForModel(modelName) {
      return (0, _emberCliMirageUtilsInflector.dasherize)(modelName);
    },

    keyForCollection: function keyForCollection(modelName) {
      return (0, _emberCliMirageUtilsInflector.dasherize)(modelName);
    },

    keyForAttribute: function keyForAttribute(attr) {
      return (0, _emberCliMirageUtilsInflector.dasherize)(attr);
    },

    keyForRelationship: function keyForRelationship(key) {
      return (0, _emberCliMirageUtilsInflector.dasherize)(key);
    },

    getHashForPrimaryResource: function getHashForPrimaryResource(resource) {
      var resourceHash = this.getHashForResource(resource);
      var hashWithRoot = { data: resourceHash };
      var addToIncludes = this.getAddToIncludesForResource(resource);

      return [hashWithRoot, addToIncludes];
    },

    getHashForIncludedResource: function getHashForIncludedResource(resource) {
      var serializer = this.serializerFor(resource.modelName);
      var hash = serializer.getHashForResource(resource);
      var hashWithRoot = { included: this.isModel(resource) ? [hash] : hash };
      var addToIncludes = [];

      if (!this.hasQueryParamIncludes()) {
        addToIncludes = this.getAddToIncludesForResource(resource);
      }

      return [hashWithRoot, addToIncludes];
    },

    getHashForResource: function getHashForResource(resource) {
      var _this = this;

      var hash = undefined;

      if (this.isModel(resource)) {
        hash = this._getResourceObjectForModel(resource);
      } else {
        hash = resource.models.map(function (m) {
          return _this._getResourceObjectForModel(m);
        });
      }

      return hash;
    },

    /*
      Returns a flat unique list of resources that need to be added to includes
    */
    getAddToIncludesForResource: function getAddToIncludesForResource(resource) {
      var relationshipPaths = undefined;

      if ((0, _lodashGet['default'])(this, 'request.queryParams.include')) {
        relationshipPaths = this.request.queryParams.include.split(',');
      } else {
        var serializer = this.serializerFor(resource.modelName);
        relationshipPaths = serializer.getKeysForIncluded();
      }

      return this.getAddToIncludesForResourceAndPaths(resource, relationshipPaths);
    },

    getAddToIncludesForResourceAndPaths: function getAddToIncludesForResourceAndPaths(resource, relationshipPaths) {
      var _this2 = this;

      var includes = [];

      relationshipPaths.forEach(function (path) {
        var relationshipNames = path.split('.');
        var newIncludes = _this2.getIncludesForResourceAndPath.apply(_this2, [resource].concat(_toConsumableArray(relationshipNames)));
        includes.push(newIncludes);
      });

      return (0, _lodash['default'])(includes).flatten().compact().uniqBy(function (m) {
        return m.toString();
      }).value();
    },

    getIncludesForResourceAndPath: function getIncludesForResourceAndPath(resource) {
      var _this3 = this;

      for (var _len = arguments.length, names = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        names[_key - 1] = arguments[_key];
      }

      var nameForCurrentResource = (0, _emberCliMirageUtilsInflector.camelize)(names.shift());
      var includes = [];
      var modelsToAdd = [];

      if (this.isModel(resource)) {
        var relationship = resource[nameForCurrentResource];

        if (this.isModel(relationship)) {
          modelsToAdd = [relationship];
        } else if (this.isCollection(relationship)) {
          modelsToAdd = relationship.models;
        }
      } else {
        resource.models.forEach(function (model) {
          var relationship = model[nameForCurrentResource];

          if (_this3.isModel(relationship)) {
            modelsToAdd.push(relationship);
          } else if (_this3.isCollection(relationship)) {
            modelsToAdd = modelsToAdd.concat(relationship.models);
          }
        });
      }

      includes = includes.concat(modelsToAdd);

      if (names.length) {
        modelsToAdd.forEach(function (model) {
          includes = includes.concat(_this3.getIncludesForResourceAndPath.apply(_this3, [model].concat(names)));
        });
      }

      return includes;
    },

    _getResourceObjectForModel: function _getResourceObjectForModel(model) {
      var _this4 = this;

      var attrs = this._attrsForModel(model, true);
      delete attrs.id;

      var hash = {
        type: this.typeKeyForModel(model),
        id: model.id,
        attributes: attrs
      };

      model.associationKeys.forEach(function (key) {
        var relationship = model[key];
        var relationshipKey = _this4.keyForRelationship(key);
        var relationshipHash = {};
        hash.relationships = hash.relationships || {};

        if (_this4.hasLinksForRelationship(model, key)) {
          var serializer = _this4.serializerFor(model.modelName);
          var links = serializer.links(model);
          relationshipHash.links = links[key];
        }

        var data = null;

        if (_this4.isModel(relationship)) {
          data = {
            type: _this4.typeKeyForModel(relationship),
            id: relationship.id
          };
        } else if (_this4.isCollection(relationship)) {
          data = relationship.models.map(function (model) {
            return {
              type: _this4.typeKeyForModel(model),
              id: model.id
            };
          });
        }

        relationshipHash.data = data;

        hash.relationships[relationshipKey] = relationshipHash;
      });

      return hash;
    },

    hasLinksForRelationship: function hasLinksForRelationship(model, relationshipKey) {
      var serializer = this.serializerFor(model.modelName);
      var links = undefined;
      if (serializer.links) {
        links = serializer.links(model);

        return links[relationshipKey] != null;
      }
    },

    getQueryParamIncludes: function getQueryParamIncludes() {
      return (0, _lodashGet['default'])(this, 'request.queryParams.include');
    },

    hasQueryParamIncludes: function hasQueryParamIncludes() {
      return !!this.getQueryParamIncludes();
    },

    typeKeyForModel: function typeKeyForModel(model) {
      return (0, _emberCliMirageUtilsInflector.dasherize)((0, _emberCliMirageUtilsInflector.pluralize)(model.modelName));
    }

  });
});