if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	const pendingScripts = [],
		firstScript = document.scripts[0],
		supportsAsync = 'async' in firstScript,
		supportsReadyState = firstScript.readyState;

	/**
	 * Modern browsers
	 *
	 * @param {string} src
	 * @returns {void}
	 */
	function loadUsingAsync(src) {
		const scriptElement = document.createElement('script');

		scriptElement.async = false;
		scriptElement.src = src;
		document.head.appendChild(scriptElement);
	}

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
	 * IE < 10
	 *
	 * @param {string} src
	 * @returns {void}
	 */
	function loadUsingReadyState(src) {
		const scriptElement = document.createElement('script');

		pendingScripts.push(scriptElement);

		// listen for state changes
		scriptElement.onreadystatechange = stateChange;

		// must set src AFTER adding onreadystatechange listener
		// else we’ll miss the loaded event for cached scripts
		scriptElement.src = src;
	}

	/**
	 * Fallback to defer
	 *
	 * @param {string} src
	 * @returns {void}
	 */
	function loadUsingDefer(src) {
		// HTML parser treats </script> as the end of script, even if in a string
		// Because of that we need to split it
		/* eslint no-useless-concat:0 */
		document.write(`<script src="${src}" defer><` + `/script>`);
	}

	/**
	 * Load multiple scripts in parallel, run them in order
	 *
	 * @param {string[]} scripts
	 * @returns {void}
	 */
	M.loadScripts = function (scripts) {
		scripts.forEach((src) => {
			if (supportsAsync) {
				// modern browsers
				loadUsingAsync(src);
			} else if (supportsReadyState) {
				loadUsingReadyState(src);
			} else {
				loadUsingDefer(src);
			}
		});
	};
})(M);
