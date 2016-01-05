/**
 * Loads google custom search script
 *
 * @param {number} mobileBreakpoint
 * @returns {void}
 */
export function loadSearch(mobileBreakpoint) {
	/**
	 * Process page query arguments
	 * @returns {object} The processed parameters
	 */
	function processArguments() {
		const params = {};
		let argParts,
			argValues,
			i;

		if (location.search) {
			argParts = location.search.substring(1).split('&');

			for (i = 0; i < argParts.length; i++) {
				argValues = argParts[i].split('=');

				if (argValues.length >= 2) {
					params[argValues[0]] = argValues[1] || true;
				}
			}
		}

		return params;
	}

	/**
	 * Fill the search text box to match the search parameter
	 * @returns {void}
	 */
	function fillSearchTextBox() {
		const params = processArguments();

		if (params.hasOwnProperty('q')) {
			if ($(document).width() < mobileBreakpoint) {
				$('#searchWikiaTextMobile').val(decodeURIComponent(params.q));
			} else {
				$('#searchWikiaText').val(decodeURIComponent(params.q));
			}
		}
	}

	// Google custom search injection
	// https://developers.google.com/custom-search/docs/tutorial/implementingsearchbox
	const searchKey = '006230450596576500385:kcgbfm7zpa8',
		url = `${document.location.protocol}//www.google.com/cse/cse.js?cx=${searchKey}`;

	$.getScript(url);
	fillSearchTextBox();
}
