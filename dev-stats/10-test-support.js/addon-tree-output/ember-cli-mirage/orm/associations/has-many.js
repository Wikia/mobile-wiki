define('ember-cli-mirage/orm/associations/has-many', ['exports', 'ember-cli-mirage/orm/associations/association', 'ember-cli-mirage/orm/collection', 'ember-cli-mirage/orm/polymorphic-collection', 'lodash/assign', 'lodash/compact', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/assert'], function (exports, _emberCliMirageOrmAssociationsAssociation, _emberCliMirageOrmCollection, _emberCliMirageOrmPolymorphicCollection, _lodashAssign, _lodashCompact, _emberCliMirageUtilsInflector, _emberCliMirageUtilsNormalizeName, _emberCliMirageAssert) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * @class HasMany
   * @extends Association
   * @constructor
   * @public
   */

  var HasMany = (function (_Association) {
    _inherits(HasMany, _Association);

    function HasMany() {
      _classCallCheck(this, HasMany);

      _get(Object.getPrototypeOf(HasMany.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasMany, [{
      key: 'getForeignKeyArray',

      /**
       * @method getForeignKeyArray
       * @return {Array} Array of camelized model name of associated objects
       * and foreign key for the object owning the association
       * @public
       */
      value: function getForeignKeyArray() {
        return [(0, _emberCliMirageUtilsInflector.camelize)(this.ownerModelName), this.getForeignKey()];
      }

      /**
       * @method getForeignKey
       * @return {String} Foreign key for the object owning the association
       * @public
       */
    }, {
      key: 'getForeignKey',
      value: function getForeignKey() {
        return (0, _emberCliMirageUtilsInflector.singularize)((0, _emberCliMirageUtilsInflector.camelize)(this.key)) + 'Ids';
      }

      /**
       * Registers has-many association defined by given key on given model,
       * defines getters / setters for associated records and associated records' ids,
       * adds methods for creating unsaved child records and creating saved ones
       *
       * @method addMethodsToModelClass
       * @param {Function} ModelClass
       * @param {String} key
       * @public
       */
    }, {
      key: 'addMethodsToModelClass',
      value: function addMethodsToModelClass(ModelClass, key) {
        var modelPrototype = ModelClass.prototype;
        var association = this;
        var foreignKey = this.getForeignKey();
        var associationHash = _defineProperty({}, key, this);

        modelPrototype.hasManyAssociations = (0, _lodashAssign['default'])(modelPrototype.hasManyAssociations, associationHash);

        // Add to target's dependent associations array
        this.schema.addDependentAssociation(this, this.modelName);

        // TODO: look how this is used. Are these necessary, seems like they could be gotten from the above?
        // Or we could use a single data structure to store this information?
        modelPrototype.associationKeys.push(key);
        modelPrototype.associationIdKeys.push(foreignKey);

        Object.defineProperty(modelPrototype, foreignKey, {

          /*
            object.childrenIds
              - returns an array of the associated children's ids
          */
          get: function get() {
            this._tempAssociations = this._tempAssociations || {};
            var tempChildren = this._tempAssociations[key];
            var ids = [];

            if (tempChildren) {
              if (association.isPolymorphic) {
                ids = tempChildren.models.map(function (model) {
                  return { type: model.modelName, id: model.id };
                });
              } else {
                ids = tempChildren.models.map(function (model) {
                  return model.id;
                });
              }
            } else {
              ids = this.attrs[foreignKey] || [];
            }

            return ids;
          },

          /*
            object.childrenIds = ([childrenIds...])
              - sets the associated children (via id)
          */
          set: function set(ids) {
            var tempChildren = undefined;

            if (ids === null) {
              tempChildren = [];
            } else if (ids !== undefined) {
              (0, _emberCliMirageAssert['default'])(Array.isArray(ids), 'You must pass an array in when seting ' + foreignKey + ' on ' + this);

              if (association.isPolymorphic) {
                (0, _emberCliMirageAssert['default'])(ids.every(function (el) {
                  return typeof el === 'object' && typeof el.type !== undefined && typeof el.id !== undefined;
                }), 'You must pass in an array of polymorphic identifiers (objects of shape { type, id }) when seting ' + foreignKey + ' on ' + this);

                var models = ids.map(function (_ref) {
                  var type = _ref.type;
                  var id = _ref.id;

                  return association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type)].find(id);
                });
                tempChildren = new _emberCliMirageOrmPolymorphicCollection['default'](models);
              } else {
                tempChildren = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(ids);
              }
            }

            this[key] = tempChildren;
          }
        });

        Object.defineProperty(modelPrototype, key, {

          /*
            object.children
              - returns an array of associated children
          */
          get: function get() {
            this._tempAssociations = this._tempAssociations || {};
            var collection = null;

            if (this._tempAssociations[key]) {
              collection = this._tempAssociations[key];
            } else {
              if (association.isPolymorphic) {
                if (this[foreignKey]) {
                  var polymorphicIds = this[foreignKey];
                  var models = polymorphicIds.map(function (_ref2) {
                    var type = _ref2.type;
                    var id = _ref2.id;

                    return association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type)].find(id);
                  });

                  collection = new _emberCliMirageOrmPolymorphicCollection['default'](models);
                } else {
                  collection = new _emberCliMirageOrmPolymorphicCollection['default'](association.modelName);
                }
              } else {
                if (this[foreignKey]) {
                  collection = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(this[foreignKey]);
                } else {
                  collection = new _emberCliMirageOrmCollection['default'](association.modelName);
                }
              }

              this._tempAssociations[key] = collection;
            }

            return collection;
          },

          /*
            object.children = [model1, model2, ...]
              - sets the associated children (via array of models or Collection)
          */
          set: function set(models) {
            var _this = this;

            if (models instanceof _emberCliMirageOrmCollection['default'] || models instanceof _emberCliMirageOrmPolymorphicCollection['default']) {
              models = models.models;
            }

            models = models ? (0, _lodashCompact['default'])(models) : [];
            this._tempAssociations = this._tempAssociations || {};

            var collection = undefined;
            if (association.isPolymorphic) {
              collection = new _emberCliMirageOrmPolymorphicCollection['default'](models);
            } else {
              collection = new _emberCliMirageOrmCollection['default'](association.modelName, models);
            }
            this._tempAssociations[key] = collection;

            models.forEach(function (model) {
              if (model.hasInverseFor(association)) {
                var inverse = model.inverseFor(association);

                model.associate(_this, inverse);
              }
            });
          }
        });

        /*
          object.newChild
            - creates a new unsaved associated child
        */
        modelPrototype['new' + (0, _emberCliMirageUtilsInflector.capitalize)((0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(association.key)))] = function () {
          var modelName = undefined,
              attrs = undefined;
          if (association.isPolymorphic) {
            modelName = arguments[0];
            attrs = arguments[1];
          } else {
            modelName = association.modelName;
            attrs = arguments[0];
          }

          var child = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(modelName)]['new'](attrs);
          var children = this[key].models;

          children.push(child);
          this[key] = children;

          return child;
        };

        /*
          object.createChild
            - creates a new saved associated child, and immediately persists both models
           TODO: forgot why this[key].add(child) doesn't work, most likely
          because these external APIs trigger saving cascades. Should probably
          have an internal method like this[key]._add.
        */
        modelPrototype['create' + (0, _emberCliMirageUtilsInflector.capitalize)((0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(association.key)))] = function () {
          var modelName = undefined,
              attrs = undefined;
          if (association.isPolymorphic) {
            modelName = arguments[0];
            attrs = arguments[1];
          } else {
            modelName = association.modelName;
            attrs = arguments[0];
          }

          var child = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(modelName)].create(attrs);
          var children = this[key].models;

          children.push(child);
          this[key] = children;

          this.save();

          return child.reload();
        };
      }

      /**
       *
       *
       * @public
      */
    }, {
      key: 'disassociateAllDependentsFromTarget',
      value: function disassociateAllDependentsFromTarget(model) {
        var _this2 = this;

        var owner = this.ownerModelName;
        var fk = undefined;

        if (this.isPolymorphic) {
          fk = { type: model.modelName, id: model.id };
        } else {
          fk = model.id;
        }

        var dependents = this.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(owner)].where(function (potentialOwner) {
          var currentIds = potentialOwner[_this2.getForeignKey()];

          // Need this check because currentIds could be null
          return currentIds && currentIds.find(function (id) {
            if (typeof id === 'object') {
              return id.type === fk.type && id.id === fk.id;
            } else {
              return id === fk;
            }
          });
        });

        dependents.models.forEach(function (dependent) {
          dependent.disassociate(model, _this2);
          dependent.save();
        });
      }
    }]);

    return HasMany;
  })(_emberCliMirageOrmAssociationsAssociation['default']);

  exports['default'] = HasMany;
});