var deepExtend: any = require('deep-extend');

var localeSettings: any = {
	'en' : {
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

localeSettings['de'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls: {
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
localeSettings['en-au'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['en-gb'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['en-ie'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['en-in'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['en-nz'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['en-za'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
			endian: 'little'
		}
	}
);

localeSettings['es'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://es.wikia.com/T%C3%A9rminos_de_Uso',
			'privacyPolicyLinkUrl': 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
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

localeSettings['es-es'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://es.wikia.com/T%C3%A9rminos_de_Uso',
			'privacyPolicyLinkUrl': 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
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

localeSettings['fi'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['fr'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://fr.wikia.com/Conditions_d%27utilisation',
			'privacyPolicyLinkUrl': 'http://fr.wikia.com/Politique_de_confidentialit%C3%A9'
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

localeSettings['it'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['ja'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://ja.wikia.com/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84',
			'privacyPolicyLinkUrl': 'http://ja.wikia.com/%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%BB%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC'
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

localeSettings['ko'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['nl'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['pl'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['pt-br'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['pt-pt'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['ru'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['sv-se'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['vi'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{},
		date :{
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

localeSettings['zh'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://zh-tw.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%A2%9D%E6%AC%BE',
			'privacyPolicyLinkUrl': 'http://zh-tw.wikia.com/wiki/%E9%9A%B1%E7%A7%81%E6%AC%8A%E6%96%B9%E9%87%9D'
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

localeSettings['zh-hans'] = deepExtend(
	{},
	localeSettings['en'],
	{
		urls :{
			'termsOfUseLinkUrl': 'http://zh.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE',
			'privacyPolicyLinkUrl': 'http://zh.wikia.com/wiki/%E9%9A%90%E7%A7%81%E6%9D%83%E6%96%B9%E9%92%88'
		},
		date :{
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

export = localeSettings;
