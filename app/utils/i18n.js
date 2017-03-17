import Ember from 'ember';
import config from '../config/environment';

import i18n from 'npm:i18next';

const {Logger} = Ember;

export function initializeI18next(language, isFastBoot, shoebox) {
	let translations = {};

	if (isFastBoot) {
		const fs = FastBoot.require('fs');

		config.translationsNamespaces.forEach(namespace => {
			[language, language.split('-')[0], 'en'].some((lang) => {
				const translationPath = `dist/mobile-wiki/locales/${lang}/${namespace}.json`;

				try {
					// TODO consider using async readFile for performance reasons
					// It's not trivial when we look for up to 3 different languages in every namespace
					translations[namespace] = JSON.parse(fs.readFileSync(translationPath));

					return true;
				} catch (exception) {
					if (lang === 'en') {
						Logger.error({
							lang,
							namespace,
							path: translationPath,
							error: exception.message
						}, `Translation for default language not found`);
					}
				}
			});
		});

		shoebox.put('translations', translations);
	} else {
		translations = shoebox.retrieve('translations');
	}

	i18n.init({
		fallbackLng: 'en',
		lng: language,
		lowerCaseLng: true,
		defaultNS: 'main',
		interpolation: {
			escapeValue: false,
			prefix: '__',
			suffix: '__'
		},
		resources: {
			[language]: translations
		}
	});
}
