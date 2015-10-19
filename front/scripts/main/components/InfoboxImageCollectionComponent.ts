/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.InfoboxImageCollectionComponent = App.MediaComponent.extend(App.ViewportMixin, {
  classNames: ['pi-image-collection'],
  layoutName: 'components/infobox-image-collection',

  limitHeight: true,
  imageAspectRatio: 16 / 9,

  activeRef: 0,
  collectionLength: Em.computed('media', function(): number {
    return this.get('media').length;
  }),

  nextButtonClass: Em.computed('activeRef', 'collectionLength', function(): string {
    return this.get('activeRef') < (this.get('collectionLength') - 1) ? 'visible' : '';
  }),

  previousButtonClass: Em.computed('activeRef', function(): string {
    return this.get('activeRef') > 0 ? 'visible' : '';
  }),

  thumbWidth: Em.computed('viewportDimensions.width', function(): number {
    return this.get('viewportDimensions.width');
  }),

  computedHeight(media: typeof App.ArticleMedia): number {
    var windowWidth: number = this.get('viewportDimensions.width'),
      imageAspectRatio: number = this.get('imageAspectRatio'),
      imageWidth: number = media.width || windowWidth,
      imageHeight: number = media.height,
      maxWidth: number = Math.floor(imageHeight * imageAspectRatio),
      computedHeight: number = imageHeight;

    if (windowWidth < imageWidth) {
      computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
    }

    //wide image- image wider than 16:9 aspect ratio
    //Crop it to have 16:9 ratio.
    if (imageWidth > maxWidth) {
      return Math.floor(windowWidth / imageAspectRatio);
    }

    //high image- image higher than square. Use top-crop-down mode.
    if (windowWidth < computedHeight) {
      return windowWidth;
    }

    return computedHeight;
  },

  setup(): void {
    var mediaArray = Em.A(),
      emptyGif = this.get('emptyGif');

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
    var image: ArticleMedia,
      cropMode = Mercury.Modules.Thumbnailer.mode.zoomCrop,
      width: number = this.get('thumbWidth'),
      height: number,
      collectionLength = this.get('collectionLength');

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
  },

  actions: {
    switchImage(direction: string) {
      var activeRef = this.get('activeRef'),
        refDirection = (direction === 'next') ? 1 : -1,
        nextRef =  activeRef + refDirection,
        activeImage = this.get('media').get(activeRef),
        nextImage = this.get('media').get(nextRef);

      activeImage.set('isActive', false);
      nextImage.set('isActive', true);
      this.set('activeRef', nextRef);
    }
  }
});
