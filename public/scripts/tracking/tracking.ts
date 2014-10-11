/// <reference path="../../../typings/ember/ember.d.ts" />
'use strict';

/**
 * Module for aggregating all tracking that Wikia uses.
 * To make trackPageView work with your tracker,
 * make it a submodule of this one and export one function 'track'
 *
 * trackPageView is called in ArticleView.onArticleChange
 */
module Wikia.Utils.Tracking {
	export function trackPageView () {
		Object.keys(this).forEach(function (tracker) {
			if (this[tracker].track) {
				Em.Logger.info('Tracking:', tracker);
				this[tracker].track();
			}
		}, this);
	}
}
