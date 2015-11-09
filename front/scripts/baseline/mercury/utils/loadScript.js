/**
 * @throws URIError exception
 * @param {*} error
 * @returns {void}
 */
function loadError(error) {
	throw new URIError(`The script ${error.target.src} is not accessible.`);
}

/**
 * @param {string} src
 * @param {Function} [fOnload]
 * @returns {void}
 */
export function loadScript(src, fOnload) {
	const script = document.createElement('script');

	script.type = 'text\/javascript';
	script.onerror = loadError;

	if (fOnload) {
		script.onload = fOnload;
	}

	document.body.appendChild(script);
	script.src = src;
}
