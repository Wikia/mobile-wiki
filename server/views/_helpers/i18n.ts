function i18nHelper (key: string, options: any): string {
	var translateWithCache: Function = this.i18n.translateWithCache,
		params: {[key: string]: string} = {},
		namespace = '',
		instance = this.i18n.getInstance(),
		// Hash object is created from parameters passed into i18n tag (i.e. foo=bar or template context).
		hash = options.hash;

	Object.keys(hash).forEach((key: string) => {
		if (key === 'ns') {
			namespace = hash[key] + ':';
		} else {
			params[key] = String(hash[key]);
		}
	});

	return translateWithCache(namespace + key, instance.lng(), params);
}

export = i18nHelper;
