Em.Handlebars.registerBoundHelper('i18n', function(value, options){
	var params = options.hash,
		self = this;

	Object.keys(params).forEach(function (key) {
		if (key !== 'boundOptions') {
			params[key] = Em.Handlebars.get(self, params[key], options);
		}
	});

	return App.get('i18n')(value, params);
}, App.Trans);