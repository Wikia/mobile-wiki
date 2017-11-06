define('ember-cli-mirage/orm/associations/association', ['exports', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageUtilsInflector) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Association = (function () {
    function Association(modelName, opts) {
      _classCallCheck(this, Association);

      if (typeof modelName === 'object') {
        // Received opts only
        this.modelName = undefined;
        this.opts = modelName;
      } else {
        // The modelName of the association. (Might not be passed in - set later
        // by schema).
        this.modelName = modelName ? (0, _emberCliMirageUtilsInflector.dasherize)(modelName) : '';
        this.opts = opts || {};
      }

      // The key pointing to the association
      this.key = '';

      // The modelName that owns this association
      this.ownerModelName = '';
    }

    /**
     * A setter for schema, since we don't have a reference at constuction time.
     *
     * @method setSchema
     * @public
    */

    _createClass(Association, [{
      key: 'setSchema',
      value: function setSchema(schema) {
        this.schema = schema;
      }

      /**
       * Returns true if the association is reflexive.
       *
       * @method isReflexive
       * @return {Boolean}
       * @public
      */
    }, {
      key: 'isReflexive',
      value: function isReflexive() {
        var isExplicitReflexive = !!(this.modelName === this.ownerModelName && this.opts.inverse);
        var isImplicitReflexive = !!(this.opts.inverse === undefined && this.ownerModelName === this.modelName);

        return isExplicitReflexive || isImplicitReflexive;
      }
    }, {
      key: 'isPolymorphic',
      get: function get() {
        return this.opts.polymorphic;
      }
    }]);

    return Association;
  })();

  exports['default'] = Association;
});