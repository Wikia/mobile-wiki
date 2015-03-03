/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/boom/boom.d.ts" />
import Boom = require('boom');
import Caching = require('../../lib/Caching');
import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

interface Comment {
	id: number;
	text: string;
	created: number;
	userName: string;
	replies?: Comment[]
}

interface User {
	id: number;
	avatar: string;
	url: string;
}

interface CommentsDataMW {
	payload: {
		comments: Comment[];
		users: {
			[index: string]: User;
		};
	};
	pagesCount: number;
	basePath: string;
}

interface CommentsData {
	payload: {
		comments: Comment[];
		users: {
			[index: string]: User;
		};
		pagesCount: number;
		basePath: string;
	};
	status: {
		code: number;
		message?: string;
		errorName?: string;
	}
}

var cachingTimes = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.disabled,
	browserTTL: Caching.Interval.disabled
};

/**
 * Wrap article comments data response
 *
 * @param commentsData Article comments payload from API
 * @returns Wrapped Article comments object
 */
function transformResponse (commentsData: CommentsDataMW): CommentsData {
	// TODO: ad hoc response wrapping, normalize across app
	return {
		payload: {
			comments: commentsData.payload.comments,
			users: commentsData.payload.users,
			pagesCount: commentsData.pagesCount,
			basePath: commentsData.basePath
		},
		status: {
			code: 200
		}
	};
}

export function get (request: Hapi.Request, reply: any): void {
	var params = {
			wikiDomain: Utils.getCachedWikiDomainName(localSettings, request.headers.host),
			articleId: parseInt(request.params.articleId, 10) || null,
			page: parseInt(request.params.page, 10) || 0
		};

	if (params.articleId === null) {
		// TODO: ad hoc error handling, use Boom everywhere?
		reply(Boom.badRequest('Invalid articleId'));
	} else {
		new MW.ArticleRequest(params.wikiDomain).comments(
			params.articleId,
			params.page
		)
		.then((response: any) => {
			reply(transformResponse(response));
			Caching.setResponseCaching(response, cachingTimes);
		}, (error: any) => {
			var preparedResult: any = wrapResult(error, {});
			reply(preparedResult).code(preparedResult.status);
		});
	}
}
