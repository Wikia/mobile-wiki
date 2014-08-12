/// <reference path="../index.ts" />

module Wikia.Utils {
	var tracker,
	    config;

	config = {
		c: 123,
		x: 'TestWiki',
		a: 'TestArticle',
		lc: 'en',
		n: 1,
		u: 0,
		s: 'mercury',
		beacon: '',
		cb: ~~(Math.random() * 99999)
	};


	tracker = new Wikia.Modules.InternalTracker({
		baseUrl: 'http://a.wikia-beacon.com/__track/special/',
		defaults: config
	});

	export function track(event, params) {
		return tracker.track(event, params);
	}
}

