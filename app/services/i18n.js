import Service, { inject as service } from '@ember/service';
import config from '../config/environment';
import i18n from 'npm:i18next';

export default Service.extend({
	fastboot: service(),
	logger: service(),
	i18nextInstance: null,

	initialize(language) {
		const fastboot = this.fastboot;
		const shoebox = fastboot.get('shoebox');

		let translations = {};

		if (fastboot.get('isFastBoot')) {
			const fs = FastBoot.require('fs');

			// Per MediaWiki's /languages/messages/MessagesZh_*.php
			const langMap = {
				'zh-hk': 'zh-hant',
				'zh-mo': 'zh-hant',
				'zh-tw': 'zh-hant',
				// zh differs from MW per Keiko's request in IRIS-6105
				zh: 'zh-hant',
				// zh is simplified chinese per crowdin conf files
				// it would be better to name it zh-hans
				// but would require updating design-system-i18n and all its clients
				'zh-cn': 'zh',
				'zh-my': 'zh',
				'zh-sg': 'zh'
			};

			config.translationsNamespaces.forEach((namespace) => {
				[
					langMap[language] || language,
					language.split('-')[0],
					'en'
				].some((lang) => {
					const translationPath = `dist/mobile-wiki/locales/${lang}/${namespace}.json`;

					try {
						// TODO consider using async readFile for performance reasons
						// It's not trivial when we look for up to 3 different languages in every namespace
						translations[namespace] = JSON.parse(fs.readFileSync(translationPath));

						return true;
					} catch (exception) {
						if (lang === 'en') {
							this.logger.error(`Translation for default language not found`, {
								lang,
								namespace,
								path: translationPath,
								error: exception.message
							});
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
				prefix: '{',
				suffix: '}'
			},
			resources: {
				[language]: translations
			}
		});


		this.set('i18nextInstance', i18nextInstance);
	},

	t() {
		return this.i18nextInstance.t(...arguments);
	}
});
