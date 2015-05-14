/// <reference path='../../../typings/hoek/hoek.d.ts' />
import Hoek = require('hoek');
function escapeQueryParams(query: any): any {
	var keys = Object.keys(query),
		obj: {[idx: string]: any} = {};

	keys.forEach((key) => {
		obj[Hoek.escapeHtml(key)] = Hoek.escapeHtml(query[key].toString());
	});

	return obj;
}
export = escapeQueryParams;
