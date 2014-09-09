/// <reference path="../../../typings/hapi/hapi.d.ts" />
/**
 * @description ArticleComments controller
 */

import http = require('http');
import MediaWiki = require('../../lib/MediaWiki');

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

export function handleRoute(params: any, callback: Function, err: Function): void {
	new MediaWiki.ArticleRequest(params.host).comments(
			params.articleId,
			params.page
		)
		.then(function(response: any) {
			callback(wrapResponse(response));
		})
		.catch(function(error: any) {
			err(error);
		});
}
