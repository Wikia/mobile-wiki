import Ember from 'ember';
import load from '../../mercury/utils/load';

export default Ember.Mixin.create({
	/**
	 * This is a hack to make PollDaddy work (HG-618)
	 * @see http://static.polldaddy.com/p/8791040.js
	 *
	 * @returns {void}
	 */
	handlePollDaddy() {
		const $polls = this.$('script[src^="http://static.polldaddy.com"]');

		$polls.each((index, script) => {
			const id = this.getPollDaddyId(script);

			if (!id) {
				Ember.Logger.error('Polldaddy script src url not recognized', script.src);
				// can't find id, continue to next script tag if there is one.
				return true;
			}

			let init = this.getPollDaddyInit(id);

			this.handlePollDaddyContainer(id, script);

			if (typeof init === 'function') {
				init();
			} else {
				// Script is in the page source but hasn't executed upon transition.
				// Load and execute it now.
				load(script.src, () => {
					init = this.getPollDaddyInit(id);
					if (typeof init === 'function') {
						init();
					} else {
						Ember.Logger.error('Polldaddy code changed', script.src);
					}
				});
			}
		});
	},

	/**
	 * Extract ID from script src
	 *
	 * @param {HTMLScriptElement} script
	 * @returns {string}
	 */
	getPollDaddyId(script) {
		const idRegEx = /(\d+)\.js$/,
			matches = script.src.match(idRegEx);

		if (matches && matches[1]) {
			return matches[1];
		}

		// id was not found from script src url
		return null;
	},

	/**
	 * @param {string} id
	 * @returns {Function}
	 */
	getPollDaddyInit(id) {
		return window[`PDV_go${id}`];
	},

	/**
	 * Avoid PollDaddy's document.write on subsequent article loads
	 *
	 * @param {string} id
	 * @param {HTMLScriptElement} script
	 * @returns {void}
	 */
	handlePollDaddyContainer(id, script) {
		if (!this.$(`#PDI_container${id}`).length) {
			const html = `<a name="pd_a_${id}" style="display: inline; padding: 0; margin: 0;"></a>` +
			`<div class="PDS_Poll" id="PDI_container${id}"></div>`;

			$(script).after(html);
		}
	}
});
