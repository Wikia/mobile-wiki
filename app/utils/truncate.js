/**
 * @param {String} text
 * @param {Number} maxLength
 * @returns {string}
 */
export default function truncate(text, maxLength = 48) {
  const ellipsisCharacter = '\u2026';

  if (typeof text !== 'string') {
    return null;
  }

  if (text.length <= maxLength) {
    return text;
  }

  const truncatedString = text.substr(0, maxLength);
  const lastWhiteSpacePos = truncatedString.search(/\s[^\s]*$/);

  if (lastWhiteSpacePos < 0) {
    return truncatedString + ellipsisCharacter;
  }

  return truncatedString.substr(0, lastWhiteSpacePos) + ellipsisCharacter;
}
