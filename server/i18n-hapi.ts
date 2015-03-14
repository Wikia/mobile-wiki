/// <reference path="../typings/hapi/hapi.d.ts" />
/// <reference path="../typings/i18next//i18next.d.ts" />
import i18n = require('i18next');
import util = require('util');

interface HapiPluginRegister {
	(server: any, options: any, next: Function): void;
	attributes?: {
		name: string;
		version: string;
	};
}

var defaults = {
	supportedLngs: ['en'],
	fallbackLng: 'en',
	lng: 'en',
	detectLngFromPath: false,
	detectLngFromHeaders: false,
	forceDetectLngFromPath: false
};

export var register: HapiPluginRegister = function (server, options, next): void {
	var i18nextOptions = util._extend(defaults, options.i18nextOptions);

	/**
	 * i18n.getInstance
	 * @description
	 */
	server.method('i18n.getInstance', (): any => {
		return i18n;
	});

	/**
	 * i18n.translateWithCache
	 * @description This method is a facade for i18next's bundled 't' method. We wrap it so that we can
	 * pass an extra language parameter for Hapi server.method caching (so you can generate keys based on languages
	 * and avoid cache pollution)
	 */
	server.method('i18n.translateWithCache', (key: string, lng: string, opts: any): string => {
		return i18n.t(key, opts);
	});

	i18n.init(i18nextOptions);

	server.ext('onPreHandler', (request: Hapi.Request, reply: any): void => {
		var translations = {},
			cookie: string;

		cookie = request.state[options.cookieName || 'i18next'] || null;
		if (cookie) {
			if (cookie !== i18n.lng() && i18nextOptions[cookie]) {
				i18n.setLng(request.state.i18next, () => {
					reply.continue();
				});
			}
		}
		reply.continue();
	});

	next();
};

register.attributes = {
	name: 'hapi-i18next',
	version: '0.0.1'
};
