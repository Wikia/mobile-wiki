function i18nHelper (key: string, options: any): string {
	var translateWithCache: Function = this.i18n.translateWithCache,
		params: {[key: string]: string} = {},
		namespace = '',
		instance = this.i18n.getInstance();
	Object.keys(options).forEach((key: string) => {
		if (key === 'ns') {
			namespace = options[key] + ':';
		} else if (options.hasOwnProperty(key)) {
			params[key] = String(options[key]);
		}
	});

	return translateWithCache(namespace + key, instance.lng(), params);
};

export = i18nHelper;
