if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	const pendingScripts = [],
		firstScript = document.scripts[0];

	/**
	 * Watch scripts load in IE
	 *
	 * @returns {void}
	 */
	function stateChange() {
		// Execute as many scripts in order as we can
		let pendingScript;

		while (pendingScripts[0] && pendingScripts[0].readyState === 'loaded') {
			pendingScript = pendingScripts.shift();
			// avoid future loading events from this script (eg, if src changes)
			pendingScript.onreadystatechange = null;
			// can't just appendChild, old IE bug if element isn't closed
			firstScript.parentNode.insertBefore(pendingScript, firstScript);
		}
	}

	/**
	 * Load multiple scripts in parallel, run them in order
	 *
	 * @param {string[]} scripts
	 * @returns {void}
	 */
	M.loadScripts = function (scripts) {
		let src = scripts.shift(),
			scriptElement;

		// loop through our script urls
		while (src) {
			if ('async' in firstScript) {
				// modern browsers
				scriptElement = document.createElement('script');
				scriptElement.async = false;
				scriptElement.src = src;
				document.head.appendChild(scriptElement);
			} else if (firstScript.readyState) {
				// IE<10
				// create a script and add it to our todo pile
				scriptElement = document.createElement('script');
				pendingScripts.push(scriptElement);
				// listen for state changes
				scriptElement.onreadystatechange = stateChange;
				// must set src AFTER adding onreadystatechange listener
				// else we’ll miss the loaded event for cached scripts
				scriptElement.src = src;
			} else {
				// fall back to defer
				/* eslint no-useless-concat:0 */
				document.write(`<script src="${src}" defer><` + `/script>`);
			}

			src = scripts.shift();
		}
	};
})(M);
