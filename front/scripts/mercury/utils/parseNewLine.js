/**
 * @param {string} rawContent
 * @returns {string}
 */
export function parseNewLine(rawContent) {
	return rawContent.trim().replace(/(?:\r\n|\r|\n)/g, '<br>');
}
