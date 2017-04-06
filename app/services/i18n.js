import Ember from 'ember';
import config from '../config/environment';
import i18n from 'npm:i18next';

const {Logger, Service, inject} = Ember;

export default Service.extend({
	fastboot: inject.service(),
	i18nextInstance: null,

	initialize(language) {
		const fastboot = this.get('fastboot'),
			shoebox = fastboot.get('shoebox');

		let translations = {};

		if (fastboot.get('isFastBoot')) {
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

		const i18nextInstance = i18n.createInstance().init({
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


		this.set('i18nextInstance', i18nextInstance);
	},

	t() {
		return this.get('i18nextInstance').t(...arguments);
	}
});
