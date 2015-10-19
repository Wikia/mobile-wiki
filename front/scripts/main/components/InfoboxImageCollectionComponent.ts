/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.InfoboxImageCollectionComponent = App.MediaComponent.extend(App.ViewportMixin, {
  classNames: ['pi-image-collection'],
  layoutName: 'components/infobox-image-collection',

  limitHeight: true,
  imageAspectRatio: 16 / 9,

  activeRef: 0,

  thumbWidth: Em.computed('viewportDimensions.width', function(): number {
    return this.get('viewportDimensions.width');
  }),

  computedHeight(media): number {
    var windowWidth: number = this.get('viewportDimensions.width');
    var imageAspectRatio: number = this.get('imageAspectRatio');
    var imageWidth: number = media.width || windowWidth;
    var imageHeight: number = media.height;
    var maxWidth: number = Math.floor(imageHeight * imageAspectRatio);
    var computedHeight: number = imageHeight;

    if (windowWidth < imageWidth) {
      computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
    }

    //wide image- image wider than 16:9 aspect ratio and inside the HeroImage module
    //Crop it to have 16:9 ratio.
    if (imageWidth > maxWidth && this.get('isInfoboxHeroImage')) {
      this.set('cropMode', Mercury.Modules.Thumbnailer.mode.zoomCrop);
      return Math.floor(windowWidth / imageAspectRatio);
    }

    //high image- image higher than square. Use top-crop-down mode.
    if (windowWidth < computedHeight) {
      this.set('cropMode', Mercury.Modules.Thumbnailer.mode.topCropDown);
      return windowWidth;
    }

    return computedHeight;
  },

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
    var width: number = this.get('thumbWidth');
    var height: number;

    // TODO: Replace this with a computed property that stores the length
    var collectionLength = this.get('media').length;

    for (; galleryRef < collectionLength ; galleryRef ++) {
      image = this.get('media').get(galleryRef);
      height = this.computedHeight(image);

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
