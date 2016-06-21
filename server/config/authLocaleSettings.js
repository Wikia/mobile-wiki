/* eslint dot-notation:0 */

import deepExtend from 'deep-extend';

const authLocaleSettings = {
	en: {
		urls: {
			termsOfUseLinkUrl: 'http://www.wikia.com/Terms_of_Use',
			privacyPolicyLinkUrl: 'http://www.wikia.com/Privacy_Policy'
		},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '/',
			dayFormat: 'DD',
			daySeparator: '/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
};

authLocaleSettings['de'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://de.wikia.com/Nutzungsbedingungen',
			privacyPolicyLinkUrl: 'http://de.wikia.com/Datenschutz'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'TT',
			daySeparator: '\/',
			yearFormat: 'JJJJ',
			yearSeparator: ''
		}
	}
);
authLocaleSettings['en-au'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['en-gb'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['en-ie'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['en-in'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['en-nz'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['en-za'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'little'
		}
	}
);

authLocaleSettings['es'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://es.wikia.com/T%C3%A9rminos_de_Uso',
			privacyPolicyLinkUrl: 'http://es.wikia.com/Pol%C3%ADtica_de_privacidad'
		},
		date: {
			endian: 'Segundo nombre',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'AAAA',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['es-es'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://es.wikia.com/T%C3%A9rminos_de_Uso',
			privacyPolicyLinkUrl: 'http://es.wikia.com/Pol%C3%ADtica_de_privacidad'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'AAAA',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['fi'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['fr'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://fr.wikia.com/Conditions_d%27utilisation',
			privacyPolicyLinkUrl: 'http://fr.wikia.com/Politique_de_confidentialit%C3%A9'
		},
		date: {
			endian: 'little',
			monthFormat: 'mm',
			monthSeparator: '\/',
			dayFormat: 'jj',
			daySeparator: '\/',
			yearFormat: 'aaaa',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['it'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://it.community.wikia.com/wiki/Wiki_della_Community:Termini_di_utilizzo',
			privacyPolicyLinkUrl: 'http://www.wikia.com/Privacy_Policy'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'GG',
			daySeparator: '\/',
			yearFormat: 'AAAA',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['ja'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://ja.wikia.com/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84',
			privacyPolicyLinkUrl: 'http://ja.wikia.com/' +
				'%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%BB%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC'
		},
		date: {
			endian: 'big',
			monthFormat: 'XX',
			monthSeparator: '月',
			dayFormat: 'XX',
			daySeparator: '日',
			yearFormat: 'XXXX',
			yearSeparator: '年'
		}
	}
);

authLocaleSettings['ko'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['nl'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['pl'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://pl.wikia.com/Zasady_U%C5%BCytkowania',
			privacyPolicyLinkUrl: 'http://pl.wikia.com/Polityka_Prywatno%C5%9Bci'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'RRRR',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['pt-br'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://www.wikia.com/Terms_of_Use',
			privacyPolicyLinkUrl: 'http://www.wikia.com/Privacy_Policy'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'AAAA',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['pt-pt'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://www.wikia.com/Terms_of_Use',
			privacyPolicyLinkUrl: 'http://www.wikia.com/Privacy_Policy'
		},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['pt'] = authLocaleSettings['pt-br'];

authLocaleSettings['ru'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://ru.community.wikia.com/wiki/%D0%92%D0%B8%D0%BA%D0%B8%D1%8F:%D0%A3%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D1%8F_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F',
			privacyPolicyLinkUrl: 'http://ru.community.wikia.com/wiki/%D0%92%D0%B8%D0%BA%D0%B8%D1%8F:%D0%9A%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C'
		},
		date: {
			endian: 'little',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'ДД',
			daySeparator: '\/',
			yearFormat: 'ГГГГ',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['sv-se'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['vi'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {},
		date: {
			endian: 'middle',
			monthFormat: 'MM',
			monthSeparator: '\/',
			dayFormat: 'DD',
			daySeparator: '\/',
			yearFormat: 'YYYY',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['zh'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://zh-tw.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%A2%9D%E6%AC%BE',
			privacyPolicyLinkUrl: 'http://zh-tw.wikia.com/wiki/%E9%9A%B1%E7%A7%81%E6%AC%8A%E6%96%B9%E9%87%9D'
		},
		date: {
			endian: 'big',
			monthFormat: '曰',
			monthSeparator: '\/',
			dayFormat: '日',
			daySeparator: '\/',
			yearFormat: '年',
			yearSeparator: ''
		}
	}
);

authLocaleSettings['zh-hans'] = deepExtend(
	{},
	authLocaleSettings['en'],
	{
		urls: {
			termsOfUseLinkUrl: 'http://zh.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE',
			privacyPolicyLinkUrl: 'http://zh.wikia.com/wiki/%E9%9A%90%E7%A7%81%E6%9D%83%E6%96%B9%E9%92%88'
		},
		date: {
			endian: '中间名',
			monthFormat: '月',
			monthSeparator: '\/',
			dayFormat: '日',
			daySeparator: '\/',
			yearFormat: '年',
			yearSeparator: ''
		}
	}
);

export default authLocaleSettings;
