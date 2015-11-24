/// <reference path='../lib/Utils.ts' />
/// <reference path='../lib/Tracking.ts' />
/// <reference path='../lib/OpenGraph.ts' />
/// <reference path="../../typings/hapi/hapi.d.ts" />

/**
 * CommunityAppConfig
 * @typedef {Object} CommunityAppConfig
 * @property {string} androidAppLink
 * @property {string} iosAppLink
 */

import MW = require('../lib/MediaWiki');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import OpenGraph = require('../lib/OpenGraph');
import Logger = require('../lib/Logger');
import localSettings = require('../../config/localSettings');
import discussionsSplashPageConfig = require('../../config/discussionsSplashPageConfig');

function showImageReview (request: Hapi.Request, reply: Hapi.Response): void {
    outputResponse(request, reply, null);
}

function outputResponse (request: Hapi.Request, reply: Hapi.Response, context: any): void {
    //Tracking.handleResponse(context, request);
    reply.view('application', context);
}

export = showImageReview;
