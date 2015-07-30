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

localeSettings['de'] = deepExtend({
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
}, localeSettings['en']);
localeSettings['en-au'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['en-gb'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['en-ie'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['en-in'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['en-nz'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['en-za'] = deepExtend({
	urls :{},
	date :{
		endian: 'little'
	}
}, localeSettings['en']);

localeSettings['es'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['es-es'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['fi'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['fr'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['it'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['ja'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['ko'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['nl'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['pl'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['pt-br'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['pt-pt'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['ru'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['sv-se'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['vi'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['zh'] = deepExtend({
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
}, localeSettings['en']);

localeSettings['zh-hans'] = deepExtend({
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
}, localeSettings['en']);

export = localeSettings;
