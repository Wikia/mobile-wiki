/*global __fail__*/

(function(Ember) {
  /**
   Helper Methods
   */
  function isPlainFunction(test) {
    return typeof test === 'function' && test.PrototypeMixin === undefined;
  }

  /**
   Generic Handler Invocation
   */
  var HANDLERS = { };

  function normalizeTest(test) {
    return isPlainFunction(test) ? test() : test;
  }

  function registerHandler(type, callback) {
    var nextHandler = HANDLERS[type] || function() { };

    HANDLERS[type] = function(message, options) {
      callback(message, options, nextHandler);
    };
  }

  function invoke(type, message, test, options) {
    if (normalizeTest(test)) { return; }

    var handlerForType = HANDLERS[type];

    if (!handlerForType) { return; }

    if (handlerForType) {
      handlerForType(message, options);
    }
  }


  /**
   Replacement Ember.deprecate handlers
   */

  var EmberError = Ember.Error;
  var Logger = Ember.Logger;

  function registerDeprecationHandler(handler) {
    registerHandler('deprecate', handler);
  }

  function formatMessage(_message, options) {
    var message = _message;

    if (options && options.id) {
      message = message + ' [deprecation id: ' + options.id + ']';
    }

    if (options && options.url) {
      message += ' See ' + options.url + ' for more details.';
    }

    return message;
  }

  registerDeprecationHandler(function logDeprecationToConsole(message, options) {
    var updatedMessage = formatMessage(message, options);

    Logger.warn('DEPRECATION: ' + updatedMessage);
  });

  registerDeprecationHandler(function logDeprecationStackTrace(message, options, next) {
    if (Ember.LOG_STACKTRACE_ON_DEPRECATION) {
      var stackStr = '';
      var error, stack;

      // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
      try { __fail__.fail(); } catch (e) { error = e; }

      if (error.stack) {
        if (error['arguments']) {
          // Chrome
          stack = error.stack.replace(/^\s+at\s+/gm, '').
            replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
            replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
          stack.shift();
        } else {
          // Firefox
          stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
            replace(/^\(/gm, '{anonymous}(').split('\n');
        }

        stackStr = '\n    ' + stack.slice(2).join('\n    ');
      }

      var updatedMessage = formatMessage(message, options);

      Logger.warn('DEPRECATION: ' + updatedMessage + stackStr);
    } else {
      next(message, options);
    }
  });

  registerDeprecationHandler(function raiseOnDeprecation(message, options, next) {
    if (Ember.ENV.RAISE_ON_DEPRECATION) {
      var updatedMessage = formatMessage(message);

      throw new EmberError(updatedMessage);
    } else {
      next(message, options);
    }
  });

  function deprecate(message, test, options) {
    invoke('deprecate', message, test, options);
  }

  Ember.Debug = Ember.Debug || {};

  if (!Ember.Debug.registerDeprecationHandler) {
    Ember.deprecate = deprecate;
    Ember.Debug.registerDeprecationHandler = registerDeprecationHandler;
    Ember.Debug._____HANDLERS__DO__NOT__USE__SERIOUSLY__I_WILL_BE_MAD = HANDLERS;
  }
})(window.Ember);
