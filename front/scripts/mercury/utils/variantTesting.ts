/// <reference path="../../baseline/mercury.d.ts" />

/**
 * @define variantTesting
 *
 * Helper for variant testing using Optimizely
 */
'use strict';

interface Window {
	optimizely?: any;
}

module Mercury.Utils.VariantTesting {
	/**
	 * Initialize Optimizely with UA
	 * @returns {void}
	 */
	export function initUA (): void {
		// Optimizely Universal Analytics Integration Code
		// as per Optimizely suggestion in this article:
		// https://help.optimizely.com/hc/en-us/articles/200039995-Integrating-Optimizely-with-Google-Universal-Analytics?flash_digest=e09d4e784c1ef44e4f0048f405f9c92396bd65a2
		window.optimizely = window.optimizely || [];
		window.optimizely.push('activateUniversalAnalytics');
	}

	/**
	 * Activates all variant tests for the current page
	 *
	 * @returns {void}
	 */
	export function activate (): void {
		var optimizely = window.optimizely;
		if (optimizely) {
			optimizely.push(['activate']);
		}
	}

	/**
	 * Tracks an event by name
	 *
	 * @param {string} eventName
	 * @returns {void}
	 */
	export function trackEvent (eventName: string): void {
		var optimizely = window.optimizely;
		if (optimizely) {
			optimizely.push(['trackEvent', eventName]);
		}
	}
}

