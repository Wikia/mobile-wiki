var deepExtend: any = require('deep-extend');

var localeSettings: any = {
	'en' : {
		urls: {
			termsOfUseLinkUrl: 'http://www.wikia.com/Terms_of_Use'
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
			termsOfUseLinkUrl: 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
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
			termsOfUseLinkUrl: 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
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
			termsOfUseLinkUrl: 'http://fr.wikia.com/Conditions_d%27utilisation'
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
			termsOfUseLinkUrl: 'http://ja.wikia.com/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84'
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
			termsOfUseLinkUrl: 'http://zh-tw.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%A2%9D%E6%AC%BE'
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
			termsOfUseLinkUrl: 'http://zh.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE'
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
