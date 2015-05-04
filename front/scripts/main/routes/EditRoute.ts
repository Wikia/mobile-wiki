/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.EditRoute = Em.Route.extend({
    model: function(params: any) {
        return App.EditModel.load(params.title, params.sectionIndex);
    },

    actions: {
        willTransition: function(transition: EmberStates.Transition) {
            this.controllerFor('application').set('fullPage', false);
            return true;
        },
        didTransition: function() {
            this.controllerFor('application').set('fullPage', true);
            window.scrollTo(0, 0);
            return true;
        }
    }
});
