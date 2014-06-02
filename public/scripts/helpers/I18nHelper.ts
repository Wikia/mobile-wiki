Em.Handlebars.registerBoundHelper('i18n', function(value: string, options: any){
	var params = options.hash,
		self = this,
		namespace = 'app';

	Object.keys(params).forEach(function (key: string) {
		if (key === 'namespace') {
			namespace = params[key]
		} else if (key !== 'boundOptions') {
			params[key] = Em.Handlebars.get(self, params[key], options);
		}
	});

	return App.get('i18n')(namespace + '.' + value, params);
}, App.Trans);