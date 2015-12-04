/**
 * This function is parsing \n, \rn, \r to <br>
 * @param {string} rawContent
 * @returns {string}
 */
export default function nl2br(rawContent) {
	return rawContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
