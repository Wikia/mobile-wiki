define('ember-exex/error', ['exports', 'ember-exex/tools', 'ember-exex/stack'], function (exports, _emberExexTools, _emberExexStack) {
  exports.BaseError = BaseError;

  //***********************************
  // Errors implementation
  //***********************************

  function BaseError() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? "Base error" : arguments[0];

    this.name = "BaseError";
    this.message = message;
    this.stack = new Error().stack;
  }

  BaseError.prototype = Object.create(Error.prototype);
  BaseError.prototype.constructor = BaseError;
  BaseError.prototype.superclass = Error;

  //***********************************
  // Errors define function
  //***********************************

  var defineError = function defineError(definition) {

    // default values
    definition = definition || {};
    definition.name = definition.name || 'CustomError';
    definition.message = definition.message || name;
    definition.code = definition.code || 0;
    definition['extends'] = definition['extends'] || BaseError;

    if (!(definition['extends'].prototype instanceof Error)) {
      throw new Error('Only Error could be extended');
    }

    // define error constructor
    var ErrorConstructor = function ErrorConstructor() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // check whether called as constructor
      if (!ErrorConstructor.prototype.isPrototypeOf(this)) {
        throw new Error(definition.name + '() must be called as constructor e.g \'new ' + definition.name + '()\'');
      }

      // check whether there is message or object in params, optionally convert message to options object
      if (typeof options === 'string') {
        options = {
          message: options
        };
      }

      // clone options first, to be able to modify options object later
      options = (0, _emberExexTools.merge)({}, options);

      // set error values
      this.message = options.message || this.message;
      this.message = options.params ? (0, _emberExexTools.replaceParams)(this.message, options.params) : this.message;
      this.code = options.code || this.code;
      this.withPreviousError(options.previous);

      // mark as exex error
      this.exex = true;

      // create stack property
      (0, _emberExexStack.createStackProperty)(this, definition.stackRemoval);
    };

    // define error prototype
    ErrorConstructor.prototype = Object.create(definition['extends'].prototype);
    ErrorConstructor.prototype.superclass = definition['extends'];

    ErrorConstructor.prototype.withDescription = function (description) {
      this.description = description;
      return this;
    };

    ErrorConstructor.prototype.withPreviousError = function (e) {
      if (e) {
        this.previous = e;
      }
      return this;
    };

    ErrorConstructor.prototype.withAdditionalData = function (additionalData) {
      if (!this.additionalData) {
        this.additionalData = [];
      }
      this.additionalData.push(additionalData);

      return this;
    };

    // generic prototype extension
    delete definition['extends'];
    delete definition['constructor'];

    for (var k in definition) {
      if (definition.hasOwnProperty(k)) {
        ErrorConstructor.prototype[k] = definition[k];
      }
    }

    return (0, _emberExexTools.renameClass)(ErrorConstructor, definition.name);
  };
  exports.defineError = defineError;
});