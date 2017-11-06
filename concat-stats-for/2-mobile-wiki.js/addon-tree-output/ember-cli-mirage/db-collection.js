define('ember-cli-mirage/db-collection', ['exports', 'lodash/assign', 'lodash/map', 'lodash/isEqual', 'lodash/sortBy'], function (exports, _lodashAssign, _lodashMap, _lodashIsEqual, _lodashSortBy) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function duplicate(data) {
    if (Array.isArray(data)) {
      return data.map(duplicate);
    } else {
      return (0, _lodashAssign['default'])({}, data);
    }
  }

  /**
   *  A collection of db records i.e. a database table.
   *  @class DbCollection
   *  @constructor
   *  @public
   */

  var DbCollection = (function () {
    function DbCollection(name, initialData, IdentityManager) {
      _classCallCheck(this, DbCollection);

      this.name = name;
      this._records = [];
      this.identityManager = new IdentityManager();

      if (initialData) {
        this.insert(initialData);
      }
    }

    /**
     * Returns a copy of the data, to prevent inadvertent data manipulation.
     * @method all
     * @public
     */

    _createClass(DbCollection, [{
      key: 'all',
      value: function all() {
        return duplicate(this._records);
      }

      /**
       * Inserts `data` into the collection. `data` can be a single object
       * or an array of objects. Returns the inserted record.
       * @method insert
       * @param data
       * @public
       */
    }, {
      key: 'insert',
      value: function insert(data) {
        var _this = this;

        if (!Array.isArray(data)) {
          return this._insertRecord(data);
        } else {
          // Need to sort in order to ensure IDs inserted in the correct order
          var sorted = (0, _lodashSortBy['default'])(data, 'id');
          return (0, _lodashMap['default'])(sorted, function (x) {
            return _this._insertRecord(x);
          });
        }
      }

      /**
       * Returns a single record from the `collection` if `ids` is a single
       * id, or an array of records if `ids` is an array of ids. Note
       * each id can be an int or a string, but integer ids as strings
       * (e.g. the string “1”) will be treated as integers.
       * @method find
       * @param ids
       * @public
       */
    }, {
      key: 'find',
      value: function find(ids) {
        if (Array.isArray(ids)) {
          var records = this._findRecords(ids).filter(Boolean).map(duplicate); // Return a copy

          return records;
        } else {
          var record = this._findRecord(ids);
          if (!record) {
            return null;
          }

          // Return a copy
          return duplicate(record);
        }
      }

      /**
       * Returns the first model from `collection` that matches the
       * key-value pairs in the `query` object. Note that a string
       * comparison is used. `query` is a POJO.
       * @method find
       * @param query
       * @public
       */
    }, {
      key: 'findBy',
      value: function findBy(query) {
        var record = this._findRecordBy(query);
        if (!record) {
          return null;
        }

        // Return a copy
        return duplicate(record);
      }

      /**
       * Returns an array of models from `collection` that match the
       * key-value pairs in the `query` object. Note that a string
       * comparison is used. `query` is a POJO.
       * @method where
       * @param query
       * @public
       */
    }, {
      key: 'where',
      value: function where(query) {
        return this._findRecordsWhere(query).map(duplicate);
      }

      /**
       * Finds the first record matching the provided query in
       * `collection`, or creates a new record using a merge of the
       * `query` and optional `attributesForCreate`.
       * @method firstOrCreate
       * @param query
       * @param attributesForCreate
       * @public
       */
    }, {
      key: 'firstOrCreate',
      value: function firstOrCreate(query) {
        var attributesForCreate = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var queryResult = this.where(query);

        var _queryResult = _slicedToArray(queryResult, 1);

        var record = _queryResult[0];

        if (record) {
          return record;
        } else {
          var mergedAttributes = (0, _lodashAssign['default'])(attributesForCreate, query);
          var createdRecord = this.insert(mergedAttributes);

          return createdRecord;
        }
      }

      /**
       * Updates one or more records in collection.
       * If attrs is the only arg present, updates all records
       * in the collection according to the key-value pairs in attrs.
       * If target is present, restricts updates to those that
       * match target. If target is a number or string, finds a
       * single record whose id is target to update. If target is
       * a POJO, queries collection for records that match the
       * key-value pairs in target, and updates their attrs.
       * Returns the updated record or records.
       * @method update
       * @param target
       * @param attrs
       * @public
       */
    }, {
      key: 'update',
      value: function update(target, attrs) {
        var _this2 = this;

        var records = undefined;

        if (typeof attrs === 'undefined') {
          var _ret = (function () {
            attrs = target;
            var changedRecords = [];

            _this2._records.forEach(function (record) {
              var oldRecord = (0, _lodashAssign['default'])({}, record);

              _this2._updateRecord(record, attrs);

              if (!(0, _lodashIsEqual['default'])(oldRecord, record)) {
                changedRecords.push(record);
              }
            });

            return {
              v: changedRecords
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        } else if (typeof target === 'number' || typeof target === 'string') {
          var id = target;
          var record = this._findRecord(id);

          this._updateRecord(record, attrs);

          return record;
        } else if (Array.isArray(target)) {
          var ids = target;
          records = this._findRecords(ids);

          records.forEach(function (record) {
            _this2._updateRecord(record, attrs);
          });

          return records;
        } else if (typeof target === 'object') {
          var query = target;
          records = this._findRecordsWhere(query);

          records.forEach(function (record) {
            _this2._updateRecord(record, attrs);
          });

          return records;
        }
      }

      /**
       * Removes one or more records in `collection`.
       * If `target` is undefined, removes all records.
       * If `target` is a number or string, removes a
       * single record using `target` as id. If `target` is
       * a POJO, queries `collection` for records that
       * match the key-value pairs in `target`, and
       * removes them from the collection.
       * @method remove
       * @param target
       * @public
       */
    }, {
      key: 'remove',
      value: function remove(target) {
        var _this3 = this;

        var records = undefined;

        if (typeof target === 'undefined') {
          this._records = [];
          this.identityManager.reset();
        } else if (typeof target === 'number' || typeof target === 'string') {
          var record = this._findRecord(target);
          var index = this._records.indexOf(record);
          this._records.splice(index, 1);
        } else if (Array.isArray(target)) {
          records = this._findRecords(target);
          records.forEach(function (record) {
            var index = _this3._records.indexOf(record);
            _this3._records.splice(index, 1);
          });
        } else if (typeof target === 'object') {
          records = this._findRecordsWhere(target);
          records.forEach(function (record) {
            var index = _this3._records.indexOf(record);
            _this3._records.splice(index, 1);
          });
        }
      }

      /*
        Private methods.
         These return the actual db objects, whereas the public
        API query methods return copies.
      */

      /**
       * @method _findRecord
       * @param id
       * @private
       */
    }, {
      key: '_findRecord',
      value: function _findRecord(id) {
        id = id.toString();

        var _records$filter = this._records.filter(function (obj) {
          return obj.id === id;
        });

        var _records$filter2 = _slicedToArray(_records$filter, 1);

        var record = _records$filter2[0];

        return record;
      }

      /**
       * @method _findRecordBy
       * @param query
       * @private
       */
    }, {
      key: '_findRecordBy',
      value: function _findRecordBy(query) {
        return this._findRecordsWhere(query)[0];
      }

      /**
       * @method _findRecords
       * @param ids
       * @private
       */
    }, {
      key: '_findRecords',
      value: function _findRecords(ids) {
        return ids.map(this._findRecord, this);
      }

      /**
       * @method _findRecordsWhere
       * @param query
       * @private
       */
    }, {
      key: '_findRecordsWhere',
      value: function _findRecordsWhere(query) {
        var records = this._records;

        function defaultQueryFunction(record) {
          var keys = Object.keys(query);

          return keys.every(function (key) {
            return String(record[key]) === String(query[key]);
          });
        }

        var queryFunction = typeof query === 'object' ? defaultQueryFunction : query;

        return records.filter(queryFunction);
      }

      /**
       * @method _insertRecord
       * @param data
       * @private
       */
    }, {
      key: '_insertRecord',
      value: function _insertRecord(data) {
        var attrs = duplicate(data);

        if (attrs && (attrs.id === undefined || attrs.id === null)) {
          attrs.id = this.identityManager.fetch(attrs);
        } else {
          attrs.id = attrs.id.toString();

          this.identityManager.set(attrs.id);
        }

        this._records.push(attrs);

        return duplicate(attrs);
      }

      /**
       * @method _updateRecord
       * @param record
       * @param attrs
       * @private
       */
    }, {
      key: '_updateRecord',
      value: function _updateRecord(record, attrs) {
        var targetId = attrs && attrs.hasOwnProperty('id') ? attrs.id.toString() : null;
        var currentId = record.id;

        if (targetId && currentId !== targetId) {
          throw new Error('Updating the ID of a record is not permitted');
        }

        for (var attr in attrs) {
          if (attr === 'id') {
            continue;
          }

          record[attr] = attrs[attr];
        }
      }
    }]);

    return DbCollection;
  })();

  exports['default'] = DbCollection;
});