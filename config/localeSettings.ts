var deepExtend: any = require('deep-extend');

var baseLocaleSettings: LocaleSettings = {},
	localeSettings: LocaleSettings = {};

baseLocaleSettings = {
	en: {
		urls: {
			'terms-of-use-link-url': 'http://www.wikia.com/Terms_of_Use'
		},
		date: {
			'endian': 'middle',
			'month-format': 'MM',
			'month-separator': '/',
			'day-format': 'DD',
			'day-separator': '/',
			'year-format': 'YYYY',
			'year-separator': ''
		}
	}
};

localeSettings['de'] = deepExtend(baseLocaleSettings['en'], {
	urls: {
		'terms-of-use-link-url': 'http://www.wikia.com/lalala'
	},
	date: {
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'TT',
		'day-separator': '\/',
		'year-format': 'JJJJ',
		'year-separator': ''
	}
});
localeSettings['en-au'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['en-gb'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['en-ie'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['en-in'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['en-nz'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['en-za'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little'
	}
});

localeSettings['es'] = deepExtend(baseLocaleSettings['en'], {
	urls :{
		'terms-of-use-link-url': 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
	},
	date: {
		'endian': 'Segundo nombre',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'AAAA',
		'year-separator': ''
	}
});

localeSettings['es-es'] = deepExtend(baseLocaleSettings['en'], {
	urls :{
		'terms-of-use-link-url': 'http://es.wikia.com/T%C3%A9rminos_de_Uso'
	},
	date: {
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'AAAA',
		'year-separator': ''
	}
});

localeSettings['fi'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['fr'] = deepExtend(baseLocaleSettings['en'], {
	urls :{
		'terms-of-use-link-url': 'http://fr.wikia.com/Conditions_d%27utilisation'
	},
	date: {
		'endian': 'little',
		'month-format': 'mm',
		'month-separator': '\/',
		'day-format': 'jj',
		'day-separator': '\/',
		'year-format': 'aaaa',
		'year-separator': ''
	}
});

localeSettings['it'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'GG',
		'day-separator': '\/',
		'year-format': 'AAAA',
		'year-separator': ''
	}
});

localeSettings['ja'] = deepExtend(baseLocaleSettings['en'], {
	urls :{
		'terms-of-use-link-url': 'http://ja.wikia.com/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84'
	},
	date: {
		'endian': 'big',
		'month-format': 'XX',
		'month-separator': '月',
		'day-format': 'XX',
		'day-separator': '日',
		'year-format': 'XXXX',
		'year-separator': '年'
	}
});

localeSettings['ko'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['nl'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['pl'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'RRRR',
		'year-separator': ''
	}
});

localeSettings['pt-br'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'AAAA',
		'year-separator': ''
	}
});

localeSettings['pt-pt'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['ru'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'little',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'ДД',
		'day-separator': '\/',
		'year-format': 'ГГГГ',
		'year-separator': ''
	}
});

localeSettings['sv-se'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['vi'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'middle',
		'month-format': 'MM',
		'month-separator': '\/',
		'day-format': 'DD',
		'day-separator': '\/',
		'year-format': 'YYYY',
		'year-separator': ''
	}
});

localeSettings['zh'] = deepExtend(baseLocaleSettings['en'], {
	urls :{
		'terms-of-use-link-url': 'http://zh.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE'
	},
	date: {
		'endian': 'big',
		'month-format': '曰',
		'month-separator': '\/',
		'day-format': '日',
		'day-separator': '\/',
		'year-format': '年',
		'year-separator': ''
	}
});

localeSettings['zh-cn'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': 'big',
		'month-format': '月',
		'month-separator': '\/',
		'day-format': '日',
		'day-separator': '\/',
		'year-format': '年',
		'year-separator': ''
	}
});

localeSettings['zh-hans'] = deepExtend(baseLocaleSettings['en'], {
	urls :{},
	date :{
		'endian': '中间名',
		'month-format': '月',
		'month-separator': '\/',
		'day-format': '日',
		'day-separator': '\/',
		'year-format': '年',
		'year-separator': ''
	}
});

localeSettings['zh-tw'] = deepExtend(baseLocaleSettings['en'], {
	urls: {
		'terms-of-use-link-url': 'http://zh-tw.wikia.com/wiki/%E4%BD%BF%E7%94%A8%E6%A2%9D%E6%AC%BE'
	},
	date: {
		'endian': 'big',
		'month-format': '曰',
		'month-separator': '\/',
		'day-format': '日',
		'day-separator': '\/',
		'year-format': '年',
		'year-separator': ''
	}
});

export = localeSettings;
