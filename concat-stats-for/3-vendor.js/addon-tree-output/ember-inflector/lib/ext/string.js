define('ember-inflector/lib/ext/string', ['ember-inflector/lib/system/string'], function (_string) {
  'use strict';

  if (Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.String) {
    /**
      See {{#crossLink "Ember.String/pluralize"}}{{/crossLink}}
       @method pluralize
      @for String
    */
    String.prototype.pluralize = function () {
      return (0, _string.pluralize)(this);
    };

    /**
      See {{#crossLink "Ember.String/singularize"}}{{/crossLink}}
       @method singularize
      @for String
    */
    String.prototype.singularize = function () {
      return (0, _string.singularize)(this);
    };
  }
});