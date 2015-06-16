import dateSettings = require('../../config/dateSettings');

var defaultDateConfig = <DateConfig> dateSettings['en'];

function getDateConfigFromLang(lang: string): DateConfig {
	return <DateConfig> dateSettings[lang] || defaultDateConfig;
}

export function get(property: string, lang: string): string {
	var dateConfig = <DateConfig> getDateConfigFromLang(lang);
	return (dateConfig[property] || defaultDateConfig[property]);
}
