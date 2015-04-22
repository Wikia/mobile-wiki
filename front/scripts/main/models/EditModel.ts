/// <reference path="../../baseline/mercury" />
/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

App.EditModel = Em.Object.extend({
    content: null,
    timestamp: null
});

App.EditModel.reopenClass({
    load: function(title: string, sectionIndex: number): Em.RSVP.Promise {
        var model = App.EditModel.create();
        return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
            Em.$.ajax({
                // FIXME: Hardcoded URL
                url: 'http://visualeditor.inez.wikia-dev.com/api.php',
                data: {
                    action: 'query',
                    prop: 'revisions',
                    // FIXME: It should be possible to pass props as an array
                    rvprop: 'content|timestamp',
                    titles: title,
                    rvsection: sectionIndex,
                    format: 'json'
                },
                dataType: 'json',
                success: (resp): void => {
                    var revision;
                    if (resp.error) {
                        reject(resp.error.code);
                        return;
                    }

                    // FIXME: MediaWiki API, seriously?
                    revision = $.map( resp.query.pages, function ( page ) {
                        return page.revisions[0];
                    } )[0];

                    model.set('content', revision['*']);
                    model.set('timestamp', revision.timestamp);
                    resolve(model);
                },
                error: (err): void => {
                    reject(err);
                }
            });
        });
    }
});
