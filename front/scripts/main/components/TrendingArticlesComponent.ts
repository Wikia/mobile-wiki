/// <reference path="../app.ts" />

'use strict';

App.TrendingArticlesComponent = Em.Component.extend({
    classNames: ['trending-articles'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    imgHeight: 150,
    imgWidth: 250,
    marginOffset: 25,

    didInsertElement: function() {
        this.imageWidthObserver();
        Em.$(window).on('resize', () => {
            this.imageWidthObserver();
        });
    },

    /**
     * @desc Computed property used to adjust image size
     */
    imageWidthObserver: Em.observer('window.innerWidth', 'document.documentElement.clientWidth', function(): void {
        var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.$('.trending-article').map((i: number, elem: HTMLElement) => {
            if (viewport > 450) {
                $(elem).width(Math.floor(viewport / 3 - this.marginOffset))
            } else {
                $(elem).width(Math.floor(viewport / 2 - this.marginOffset))
            }
        });
    })
});
