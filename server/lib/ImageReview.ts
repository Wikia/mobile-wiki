/// <reference path="../../typings/mercury/mercury-server.d.ts" />

import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');

export class ImageReviewRequestHelper {
    params: ArticleRequestParams;

    constructor(params: ArticleRequestParams) {
        this.params = params;
    }

    setTitle(title: string): void {
        this.params.title = title;
    }

    getWikiVariablesAndDetails(): Promise<CuratedContentPageData> {
        var requests = [
            new MediaWiki.ArticleRequest(this.params).mainPageDetailsAndAdsContext(),
            new MediaWiki.WikiRequest({
                wikiDomain: this.params.wikiDomain
            }).wikiVariables()
        ];

        logger.debug(this.params, 'Fetching imaged to review and main page details');

        /**
         * @see https://github.com/petkaantonov/bluebird/blob/master/API.md#settle---promise
         *
         * From Promise.settle documentation:
         * Given an array, or a promise of an array, which contains promises (or a mix of promises and values)
         * return a promise that is fulfilled when all the items in the array are either fulfilled or rejected.
         * The fulfillment value is an array of PromiseInspection instances at respective positions in relation
         * to the input array. This method is useful for when you have an array of promises and you'd like to know
         * when all of them resolve - either by fulfilling of rejecting.
         */
        return Promise.settle(requests)
            .then((results: Promise.Inspection<Promise<CuratedContentPageData>>[]) => {
                var mainPageDataPromise: Promise.Inspection<Promise<MainPageDetailsAndAdsContextResponse>> = results[0],
                    wikiVariablesPromise: Promise.Inspection<Promise<any>> = results[1],
                    isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled(),
                    mainPageData: MainPageDetailsAndAdsContextResponse,
                    mainPageDataException: MWException,
                    wikiVariables: any;

                if (mainPageDataPromise.isFulfilled()) {
                    mainPageData = mainPageDataPromise.value();
                } else {
                    mainPageDataException = mainPageDataPromise.reason();
                }

                wikiVariables = isWikiVariablesPromiseFulfilled ?
                    wikiVariablesPromise.value() :
                    wikiVariablesPromise.reason();

                if (!isWikiVariablesPromiseFulfilled) {
                    return Promise.reject(new MediaWiki.WikiVariablesRequestError(wikiVariables));
                }

                if (mainPageData && mainPageData.data) {
                    return Promise.resolve({
                        mainPageData: mainPageData.data,
                        wikiVariables,
                        server: Utils.createServerData(localSettings, this.params.wikiDomain)
                    });
                } else {
                    return Promise.reject(new MainPageDataRequestError({
                        exception: mainPageDataException,
                        wikiVariables,
                        server: Utils.createServerData(localSettings, this.params.wikiDomain)
                    }));
                }
            });
    }
}

export class MainPageDataRequestError {
    private data: any;

    constructor(data: any) {
        Error.apply(this, arguments);
        this.data = data;
    }
}
MainPageDataRequestError.prototype = Object.create(Error.prototype);
