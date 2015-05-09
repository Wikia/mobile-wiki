/// <reference path="../app.ts" />

'use strict';

App.TrendingArticlesComponent = Em.Component.extend({
    classNames: ['trending-articles'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    imageHeight: 150,
    imageWidth: 250,
    marginOffset: 25,
    viewportTreshold: 450,

    didInsertElement: function(): void {
        this.imageWidthObserver();
        Em.$(window).on('resize', () => {
            this.imageWidthObserver();
        });
    },

    /**
     * @desc Observes current viewport width and defines how to display the
     * trending articles - in 2 or in 3 columns
     */
    imageWidthObserver: Em.observer('window.innerWidth', 'document.documentElement.clientWidth', function(): void {
        var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.$('.trending-article').map((i: number, elem: HTMLElement) => {
            if (viewport > viewportTreshold) {
                //case for the landscape view - we want to have 3 images in row
                $(elem).width(Math.floor(viewport / 3 - this.marginOffset))
            } else {
                //case for the portrait view - we want to have 2 images in row
                $(elem).width(Math.floor(viewport / 2 - this.marginOffset))
            }
        });
    })
});
