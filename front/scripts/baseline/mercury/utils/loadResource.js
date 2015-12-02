if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 }
	 * @throws URIError exception
	 * @param {*} error
	 * @returns {void}
	 */
	function loadError(error) {
		throw new URIError(`The resource ${error.target.src} is not accessible.`);
	}

	/**
	 * @param {string} src
	 * @returns {void}
	 */
	M.loadResource = function (src) {
		fetch(src)
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				const div = document.createElement('div');

				div.innerHTML = text;
				document.body.insertBefore(div.childNodes[0], document.body.firstChild);
			})
			.catch((error) => loadError(error));
	};
})(M);
