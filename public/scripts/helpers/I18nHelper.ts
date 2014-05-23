Ember.Handlebars.helper('i18n', function(value, options) {
	var escaped = Wikia.get('i18n').t(Handlebars.Utils.escapeExpression(value));
	return new Ember.Handlebars.SafeString(escaped);
});