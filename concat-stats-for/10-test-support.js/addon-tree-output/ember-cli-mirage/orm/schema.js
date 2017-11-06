define('ember-cli-mirage/orm/schema', ['exports', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/orm/associations/association', 'ember-cli-mirage/orm/collection', 'lodash/assign', 'lodash/forIn', 'lodash/includes', 'ember-cli-mirage/assert'], function (exports, _emberCliMirageUtilsInflector, _emberCliMirageUtilsNormalizeName, _emberCliMirageOrmAssociationsAssociation, _emberCliMirageOrmCollection, _lodashAssign, _lodashForIn, _lodashIncludes, _emberCliMirageAssert) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /**
   * @class Schema
   * @constructor
   * @public
   */

  var Schema = (function () {
    function Schema(db) {
      var modelsMap = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, Schema);

      (0, _emberCliMirageAssert['default'])(db, 'A schema requires a db');

      this.db = db;
      this._registry = {};
      this._dependentAssociations = { polymorphic: [] };
      this.registerModels(modelsMap);
    }

    /**
     * @method registerModels
     * @param hash
     * @public
     */

    _createClass(Schema, [{
      key: 'registerModels',
      value: function registerModels() {
        var _this = this;

        var hash = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        (0, _lodashForIn['default'])(hash, function (model, key) {
          _this.registerModel(key, hash[key]);
        });
      }

      /**
       * @method registerModel
       * @param type
       * @param ModelClass
       * @public
       */
    }, {
      key: 'registerModel',
      value: function registerModel(type, ModelClass) {
        var _this2 = this;

        var camelizedModelName = (0, _emberCliMirageUtilsInflector.camelize)(type);
        var modelName = (0, _emberCliMirageUtilsInflector.dasherize)(camelizedModelName);

        // Avoid mutating original class, because we may want to reuse it across many tests
        ModelClass = ModelClass.extend();

        // Store model & fks in registry
        // TODO: don't think this is needed anymore
        this._registry[camelizedModelName] = this._registry[camelizedModelName] || { 'class': null, foreignKeys: [] }; // we may have created this key before, if another model added fks to it
        this._registry[camelizedModelName]['class'] = ModelClass;

        // TODO: set here, remove from model#constructor
        ModelClass.prototype._schema = this;
        ModelClass.prototype.modelName = modelName;
        // Set up associations
        ModelClass.prototype.hasManyAssociations = {}; // a registry of the model's hasMany associations. Key is key from model definition, value is association instance itself
        ModelClass.prototype.belongsToAssociations = {}; // a registry of the model's belongsTo associations. Key is key from model definition, value is association instance itself
        ModelClass.prototype.associationKeys = []; // ex: address.user, user.addresses
        ModelClass.prototype.associationIdKeys = []; // ex: address.user_id, user.address_ids
        ModelClass.prototype.dependentAssociations = []; // a registry of associations that depend on this model, needed for deletion cleanup.

        var fksAddedFromThisModel = {};
        for (var associationProperty in ModelClass.prototype) {
          if (ModelClass.prototype[associationProperty] instanceof _emberCliMirageOrmAssociationsAssociation['default']) {
            var association = ModelClass.prototype[associationProperty];
            association.key = associationProperty;
            association.modelName = association.modelName || (0, _emberCliMirageUtilsNormalizeName.toModelName)(associationProperty);
            association.ownerModelName = modelName;
            association.setSchema(this);

            // Update the registry with this association's foreign keys. This is
            // essentially our "db migration", since we must know about the fks.

            var _association$getForeignKeyArray = association.getForeignKeyArray();

            var _association$getForeignKeyArray2 = _slicedToArray(_association$getForeignKeyArray, 2);

            var fkHolder = _association$getForeignKeyArray2[0];
            var fk = _association$getForeignKeyArray2[1];

            fksAddedFromThisModel[fkHolder] = fksAddedFromThisModel[fkHolder] || [];
            (0, _emberCliMirageAssert['default'])(!(0, _lodashIncludes['default'])(fksAddedFromThisModel[fkHolder], fk), 'Your \'' + type + '\' model definition has multiple possible inverse relationships of type \'' + fkHolder + '\'.\n\n          Please read the associations guide and specify explicit inverses: http://www.ember-cli-mirage.com/docs/v0.2.x/models/#associations');
            fksAddedFromThisModel[fkHolder].push(fk);

            this._addForeignKeyToRegistry(fkHolder, fk);

            // Augment the Model's class with any methods added by this association
            association.addMethodsToModelClass(ModelClass, associationProperty);
          }
        }

        // Create a db collection for this model, if doesn't exist
        var collection = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(modelName);
        if (!this.db[collection]) {
          this.db.createCollection(collection);
        }

        // Create the entity methods
        this[collection] = {
          camelizedModelName: camelizedModelName,
          'new': function _new(attrs) {
            return _this2['new'](camelizedModelName, attrs);
          },
          create: function create(attrs) {
            return _this2.create(camelizedModelName, attrs);
          },
          all: function all(attrs) {
            return _this2.all(camelizedModelName, attrs);
          },
          find: function find(attrs) {
            return _this2.find(camelizedModelName, attrs);
          },
          findBy: function findBy(attrs) {
            return _this2.findBy(camelizedModelName, attrs);
          },
          where: function where(attrs) {
            return _this2.where(camelizedModelName, attrs);
          },
          first: function first(attrs) {
            return _this2.first(camelizedModelName, attrs);
          }
        };

        return this;
      }

      /**
       * @method modelFor
       * @param type
       * @public
       */
    }, {
      key: 'modelFor',
      value: function modelFor(type) {
        return this._registry[type];
      }

      /**
       * @method new
       * @param type
       * @param attrs
       * @public
       */
    }, {
      key: 'new',
      value: function _new(type, attrs) {
        return this._instantiateModel((0, _emberCliMirageUtilsInflector.dasherize)(type), attrs);
      }

      /**
       * @method create
       * @param type
       * @param attrs
       * @public
       */
    }, {
      key: 'create',
      value: function create(type, attrs) {
        return this['new'](type, attrs).save();
      }

      /**
       * @method all
       * @param type
       * @public
       */
    }, {
      key: 'all',
      value: function all(type) {
        var collection = this._collectionForType(type);

        return this._hydrate(collection, (0, _emberCliMirageUtilsInflector.dasherize)(type));
      }

      /**
       * @method find
       * @param type
       * @param ids
       * @public
       */
    }, {
      key: 'find',
      value: function find(type, ids) {
        var collection = this._collectionForType(type);
        var records = collection.find(ids);

        if (Array.isArray(ids)) {
          (0, _emberCliMirageAssert['default'])(records.length === ids.length, 'Couldn\'t find all ' + (0, _emberCliMirageUtilsInflector.pluralize)(type) + ' with ids: (' + ids.join(',') + ') (found ' + records.length + ' results, but was looking for ' + ids.length + ')');
        }

        return this._hydrate(records, (0, _emberCliMirageUtilsInflector.dasherize)(type));
      }

      /**
       * @method findBy
       * @param type
       * @param attributeName
       * @public
       */
    }, {
      key: 'findBy',
      value: function findBy(type, query) {
        var collection = this._collectionForType(type);
        var records = collection.findBy(query);

        return this._hydrate(records, (0, _emberCliMirageUtilsInflector.dasherize)(type));
      }

      /**
       * @method where
       * @param type
       * @param query
       * @public
       */
    }, {
      key: 'where',
      value: function where(type, query) {
        var collection = this._collectionForType(type);
        var records = collection.where(query);

        return this._hydrate(records, (0, _emberCliMirageUtilsInflector.dasherize)(type));
      }

      /**
       * @method first
       * @param type
       * @public
       */
    }, {
      key: 'first',
      value: function first(type) {
        var collection = this._collectionForType(type);

        var _collection = _slicedToArray(collection, 1);

        var record = _collection[0];

        return this._hydrate(record, (0, _emberCliMirageUtilsInflector.dasherize)(type));
      }
    }, {
      key: 'modelClassFor',
      value: function modelClassFor(modelName) {
        return this._registry[(0, _emberCliMirageUtilsInflector.camelize)(modelName)]['class'].prototype;
      }

      /*
        This method updates the dependentAssociations registry, which is used to
        keep track of which models depend on a given association. It's used when
        deleting models - their dependents need to be looked up and foreign keys
        updated.
         For example,
             schema = {
              post: Model.extend(),
              comment: Model.extend({
                post: belongsTo()
              })
            };
             comment1.post = post1;
            ...
            post1.destroy()
         Deleting this post should clear out comment1's foreign key.
         Polymorphic associations can have _any_ other model as a dependent, so we
        handle them separately.
      */
    }, {
      key: 'addDependentAssociation',
      value: function addDependentAssociation(association, modelName) {
        if (association.isPolymorphic) {
          this._dependentAssociations.polymorphic.push(association);
        } else {
          this._dependentAssociations[modelName] = this._dependentAssociations[modelName] || [];
          this._dependentAssociations[modelName].push(association);
        }
      }
    }, {
      key: 'dependentAssociationsFor',
      value: function dependentAssociationsFor(modelName) {
        var directDependents = this._dependentAssociations[modelName] || [];
        var polymorphicAssociations = this._dependentAssociations.polymorphic || [];

        return directDependents.concat(polymorphicAssociations);
      }
    }, {
      key: 'associationsFor',
      value: function associationsFor(modelName) {
        var modelClass = this.modelClassFor(modelName);

        return (0, _lodashAssign['default'])({}, modelClass.belongsToAssociations, modelClass.hasManyAssociations);
      }

      /*
        Private methods
      */

      /**
       * @method _collectionForType
       * @param type
       * @private
       */
    }, {
      key: '_collectionForType',
      value: function _collectionForType(type) {
        var collection = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type);
        (0, _emberCliMirageAssert['default'])(this.db[collection], 'You\'re trying to find model(s) of type ' + type + ' but this collection doesn\'t exist in the database.');

        return this.db[collection];
      }

      /**
       * @method _addForeignKeyToRegistry
       * @param type
       * @param fk
       * @private
       */
    }, {
      key: '_addForeignKeyToRegistry',
      value: function _addForeignKeyToRegistry(type, fk) {
        this._registry[type] = this._registry[type] || { 'class': null, foreignKeys: [] };

        var fks = this._registry[type].foreignKeys;
        if (!(0, _lodashIncludes['default'])(fks, fk)) {
          fks.push(fk);
        }
      }

      /**
       * @method _instantiateModel
       * @param modelName
       * @param attrs
       * @private
       */
    }, {
      key: '_instantiateModel',
      value: function _instantiateModel(modelName, attrs) {
        var ModelClass = this._modelFor(modelName);
        var fks = this._foreignKeysFor(modelName);

        return new ModelClass(this, modelName, attrs, fks);
      }

      /**
       * @method _modelFor
       * @param modelName
       * @private
       */
    }, {
      key: '_modelFor',
      value: function _modelFor(modelName) {
        return this._registry[(0, _emberCliMirageUtilsInflector.camelize)(modelName)]['class'];
      }

      /**
       * @method _foreignKeysFor
       * @param modelName
       * @private
       */
    }, {
      key: '_foreignKeysFor',
      value: function _foreignKeysFor(modelName) {
        return this._registry[(0, _emberCliMirageUtilsInflector.camelize)(modelName)].foreignKeys;
      }

      /**
       * Takes a record and returns a model, or an array of records
       * and returns a collection.
       *
       * @method _hydrate
       * @param records
       * @param modelName
       * @private
       */
    }, {
      key: '_hydrate',
      value: function _hydrate(records, modelName) {
        if (Array.isArray(records)) {
          var models = records.map(function (record) {
            return this._instantiateModel(modelName, record);
          }, this);
          return new _emberCliMirageOrmCollection['default'](modelName, models);
        } else if (records) {
          return this._instantiateModel(modelName, records);
        } else {
          return null;
        }
      }
    }]);

    return Schema;
  })();

  exports['default'] = Schema;
});