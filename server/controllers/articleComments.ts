/// <reference path="../../typings/hapi/hapi.d.ts" />
/**
 * @description ArticleComments controller
 */

import http = require('http');
import MediaWiki = require('../lib/MediaWiki');

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

function wrapResponse( commentsData: CommentsDataMW ): CommentsData {
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

/**
 * @description Handler for /articleComments/{wiki}/{articleId}/{page?}
 */

export function handleRoute(request: Hapi.Request, reply: any): void {
	new MediaWiki.ArticleRequest({
		name: request.params.wiki
	}).articleComments(
			parseInt(request.params.articleId, 10),
			parseInt(request.params.page, 10) || 1
		)
		.then(function(response: any) {
			reply(wrapResponse(response));
		})
		.catch(function(error) {
			reply(error);
		});
}
