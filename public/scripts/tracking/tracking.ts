'use strict';

module Wikia.Tracking {
	export function trackPageView () {
		Object.keys(this).forEach(function (tracker) {
			if (this[tracker].track) {
				Em.Logger.info('Tracking:', tracker);
				this[tracker].track();
			}
		}, this);
	}
}
