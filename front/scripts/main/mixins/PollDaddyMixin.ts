/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/loadScript.ts" />

'use strict';

App.PollDaddyMixin = Em.Mixin.create({
	/**
	 * This is a hack to make PollDaddy work (HG-618)
	 * @see http://static.polldaddy.com/p/8791040.js
	 */
	handlePollDaddy: function (): void {
		var $polls = this.$('script[src^="http://static.polldaddy.com"]');

		$polls.each((index: number, script: HTMLScriptElement): any => {
			var init: Function,
				id: string = this.getPollDaddyId(script);

			if (!id) {
				Em.Logger.error('Polldaddy script src url not recognized', script.src);
				// can't find id, continue to next script tag if there is one.
				return true;
			}

			init = this.getPollDaddyInit(id);

			if (typeof init === 'function') {
				this.handlePollDaddyContainer(id, script);
				init();
			} else {
				this.handlePollDaddyContainer(id, script);
				// If the script is in the page source but hasn't executed upon transition, load and execute it now
				M.loadScript(script.src, () => {
					init = this.getPollDaddyInit(id);
					if (typeof init === 'function') {
						init();
					} else {
						Em.Logger.error('Polldaddy code changed', script.src);
					}
				});
			}
		});
	},

	getPollDaddyId: function (script: HTMLScriptElement): string {
		// extract ID from script src
		var idRegEx: RegExp = /(\d+)\.js$/,
			matches: any = script.src.match(idRegEx);

		if (matches && matches[1]) {
			return matches[1];
		}

		// id was not found from script src url
		return null;
	},

	getPollDaddyInit: function (id: string): Function {
		return window['PDV_go' + id];
	},

	/**
	 * Avoid PollDaddy's document.write on subsequent article loads
	 */
	handlePollDaddyContainer: function (id: string, script: HTMLScriptElement): void {
		var html: string;

		if (!this.$('#PDI_container' + id).length) {
			html = '<a name="pd_a_' + id + '" style="display: inline; padding: 0px; margin: 0px;"></a>' +
			'<div class="PDS_Poll" id="PDI_container' + id + '"></div>';
			$(script).after(html);
		}
	}
});