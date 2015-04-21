/// <reference path="../../baseline/mercury" />
/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />


App.EditModel = Em.Object.extend({
    wikitext: 'old random wikitext'
});

App.EditModel.reopenClass({
    load: function(title: string, sectionIndex: number): Em.RSVP.Promise {
        console.log("->load", title, sectionIndex);
        var model = App.EditModel.create();
        return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
            setTimeout(function() {
                model.set('wikitext', "Some ''random'' wikitext");
                resolve(model);
            }, 2500);
        });
    }
});
