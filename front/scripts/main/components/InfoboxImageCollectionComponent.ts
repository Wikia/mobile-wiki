/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.InfoboxImageCollectionComponent = App.MediaComponent.extend({
  classNames: ['pi-image-collection'],
  layoutName: 'components/infobox-image-collection',

  activeRef: 0,

  setup(): void {
    var mediaArray = Em.A();
    var emptyGif = this.get('emptyGif');

    this.get('media').forEach((image: ArticleMedia, index: number) => {
      image.galleryRef = index;
      image.thumbUrl = emptyGif;
      image.isActive = (index === this.get('activeRef')) ? true : false;

      mediaArray.pushObject(Em.Object.create(image));
    });

    this.setProperties({
      media: mediaArray
    });
  },

  loadImages(galleryRef: number = 0): void {
    var image: ArticleMedia;
    var cropMode = Mercury.Modules.Thumbnailer.mode.zoomCrop;

    // TODO: Replace these magic numbers with functions to get desired width/height
    var width: number = 320;
    var height: number = 320;

    // TODO: Replace this with a computed property that stores the length
    var collectionLength = this.get('media').length;

    for (; galleryRef < collectionLength ; galleryRef ++) {
      image = this.get('media').get(galleryRef);

      var thumbUrl = this.getThumbURL(image.url, {
        mode: cropMode,
        width: width,
        height: height
      });

      image.setProperties({
        thumbUrl: thumbUrl,
        load: true
      });
    }
  },

  load(): void {
    this.setup();
    this.loadImages();
  }
});
