function i18nHelper (key, options) {
	var translateWithCache: Function = this.i18n.translateWithCache,
		params: {[key: string]: string} = {},
		namespace = '',
		instance = this.i18n.getInstance();

	Object.keys(options.hash).forEach((key: string) => {
		if (key === 'ns') {
			namespace = options.hash[key] + ':';
		} else if (options.hasOwnProperty(key)) {
			params[key] = String(options.hash[key]);
		}
	});

	return translateWithCache(namespace +  key, instance.lng(), params);
};

export = i18nHelper;
