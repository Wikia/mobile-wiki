
interface LocaleProperty {
	[property: string]: string;
}

interface LocaleConfig {
	urls: LocaleProperty;
	date: LocaleProperty;
}

interface LocaleSettings {
	[lang: string]: LocaleConfig;
}
