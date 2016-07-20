if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * @param {string} src
	 * @returns {void}
	 */
	M.loadDOMResource = function (src) {
		const ajax = new XMLHttpRequest();

		ajax.onload = () => {
			const div = document.createElement('div');

			div.innerHTML = ajax.responseText;
			div.style = 'height: 0; width: 0; position: absolute;';
			document.body.insertBefore(div, document.body.firstChild);
		};

		ajax.onerror = (error) => {
			throw new URIError(`The resource ${error.target.src} is not accessible.`);
		};

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
