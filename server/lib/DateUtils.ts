import dateSettings = require('../../config/dateSettings');

var defaultDateConfig = <DateConfig> dateSettings['en'];

function getDateConfigFromLang(lang: string): DateConfig {
	return dateSettings[lang] || defaultDateConfig;
}

/**
 * Getter for DateConfig properties like endianness or M/D/Y formats
 * @param {string} property
 * @param {string} lang
 * @returns {string}
 */
export function get(property: string, lang: string): string {
	var dateConfig = <DateConfig> getDateConfigFromLang(lang);
	return dateConfig[property] || defaultDateConfig[property];
}
