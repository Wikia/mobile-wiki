App.CuratedContentItemComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.ViewportMixin,
	{
		tagName: 'a',
		attributeBindings: ['href'],
		classNames: ['curated-content-item'],
		classNameBindings: ['type'],
		style: null,
		href: Em.computed.oneWay('model.url'),
		type: Em.computed.oneWay('model.type'),

		isArticle: Em.computed.equal('model.type', 'article'),

		aspectRatio: 1,
		imageWidth: 200,
		thumbUrl: Em.computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(
					this.get('model.imageUrl'),
					this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
				);
			} else {
				return this.get('emptyGif');
			}
		}),

		icon: Em.computed('type', function () {
			const type = this.get('type'),
				typesWithDedicatedIcon = ['category', 'video', 'image', 'blog'];

			let iconType;

			if (typesWithDedicatedIcon.indexOf(type) > -1) {
				iconType = type;
			} else if (type === 'section') {
				// Sections use the same icons as categories
				iconType = 'category';
			} else {
				// Default icon
				iconType = 'article';
			}

			return `namespace-${iconType}`;
		}),

		viewportObserver: Em.on('init', Em.observer('viewportDimensions.width', function () {
			this.updateImageSize();
		})),

		/**
		 * @returns {void}
		 */
		click() {
			this.sendAction('action', this.get('model'));
		},

		/**
		 * @returns {void}
		 */
		updateImageSize() {
			const imageSize = String(Math.floor((this.get('viewportDimensions.width') - 20) / 2));

			this.set('style', new Em.Handlebars.SafeString(`height: ${imageSize}px; width: ${imageSize}px;`));
		},
	}
);
