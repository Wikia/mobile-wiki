/// <reference path="../app.ts" />
'use strict';

App.ClickHandlerMixin = Em.Mixin.create({
	/**
	 * @desc Returns true if handleMedia() should be executed
	 * @param {EventTarget} target
	 * @param {string} tagName clicked tag name
	 * @returns {boolean}
	 */
	shouldHandleMedia: function (target: EventTarget, tagName: string): boolean {
		return tagName === 'img' || tagName === 'figure'
			&& $(target).children('a').length === 0;
	},

	/**
	 * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
	 */
	shouldHandleClick: function (target: EventTarget): boolean {
		var $target = $(target);

		return (
			$target.closest('.mw-content').length &&
			// ignore polldaddy content
			!$target.closest('.PDS_Poll').length
		);
	},
});
