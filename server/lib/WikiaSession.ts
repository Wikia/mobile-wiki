/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path='../../typings/wreck/wreck.d.ts' />
/// <reference path='../../typings/boom/boom.d.ts' />

interface WhoAmIResponse {
	'userId'?: string;
	'status'?: number;
}

import Boom          = require('boom');
import qs            = require('querystring');
import Wreck         = require('wreck');
import localSettings = require('../../config/localSettings');
import Logger        = require('./Logger');
import authUtils     = require('./AuthUtils');

module WikiaSession {
	export function scheme (server: Hapi.Server, options: any): {authenticate: any} {
		return {
			authenticate: (request: any, reply: any): void => {
				var accessToken: string = request.state.access_token,
					callback = (err: any, response: any, payload: string): any => {
						var parsed: WhoAmIResponse,
							parseError: Error;

						try {
							parsed = JSON.parse(payload);
						} catch (e) {
							parseError = e;
						}

						// Detects an error with the connection
						if (err || parseError) {
							Logger.error('WhoAmI connection error: ', {
								err: err,
								parseError: parseError
							});
							return reply(Boom.unauthorized('WhoAmI connection error'));
						}

						if (parsed.status && parsed.status != 200) {
							if (parsed.status === 401) {
								reply.unstate('access_token');
							}
							return reply(Boom.unauthorized('Token not authorized by WhoAmI'));
						}
						return reply.continue({credentials: {userId: parsed.userId}});
					};

				if (!accessToken) {
					return reply(Boom.unauthorized('No access_token'));
				}

				Wreck.get(
					authUtils.getWhoAmIUrl(),
					{
						timeout: localSettings.whoAmIService.timeout,
						headers: {
							Cookie: 'access_token=' + encodeURIComponent(accessToken)
						}
					},
					callback
				);
			}
		};
	}
}

export = WikiaSession;
