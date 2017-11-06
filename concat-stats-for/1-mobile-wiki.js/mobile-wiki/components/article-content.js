define('mobile-wiki/components/article-content', ['exports', 'mobile-wiki/mixins/ads', 'mobile-wiki/utils/render-component', 'mobile-wiki/utils/article-media', 'mobile-wiki/utils/track'], function (exports, _ads, _renderComponent, _articleMedia, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var reads = Ember.computed.reads;
	var Component = Ember.Component;
	var $ = Ember.$;
	var isBlank = Ember.isBlank;
	var observer = Ember.observer;
	var on = Ember.on;
	var run = Ember.run;
	exports.default = Component.extend(_ads.default, {
		tagName: 'article',
		classNames: ['article-content', 'mw-content'],

		fastboot: service(),
		i18n: service(),
		logger: service(),
		isFastBoot: reads('fastboot.isFastBoot'),

		adsContext: null,
		content: null,
		contributionEnabled: null,
		displayEmptyArticleInfo: true,
		displayTitle: null,
		isPreview: false,
		media: null,

		articleContentObserver: on('init', observer('content', function () {
			var _this = this;

			// Our hacks don't work in FastBoot, so we just inject raw HTML in the template
			if (this.get('isFastBoot')) {
				return;
			}

			this.destroyChildComponents();

			run.scheduleOnce('afterRender', this, function () {
				var rawContent = _this.get('content');

				if (!isBlank(rawContent)) {
					_this.hackIntoEmberRendering(rawContent);

					_this.handleInfoboxes();
					_this.replaceInfoboxesWithInfoboxComponents();
					_this.renderedComponents = _this.renderedComponents.concat((0, _renderComponent.queryPlaceholders)(_this.$()).map(_articleMedia.default, {
						media: _this.get('media'),
						openLightbox: _this.get('openLightbox')
					}).map(_this.renderComponent));

					_this.loadIcons();
					_this.createTableOfContents();
					_this.createContributionButtons();
					_this.handleTables();
					_this.replaceWikiaWidgetsWithComponents();
					_this.handleWikiaWidgetWrappers();
					_this.handleJumpLink();
				} else if (_this.get('displayEmptyArticleInfo')) {
					_this.hackIntoEmberRendering('<p>' + _this.get('i18n').t('article.empty-label') + '</p>');
				}

				if (!_this.get('isPreview')) {
					_this.setupAdsContext(_this.get('adsContext'));
					_this.get('ads.module').onReady(function () {
						_this.injectAds();
					});
				}
			});
		})),

		init: function init() {
			this._super.apply(this, arguments);

			this.renderComponent = (0, _renderComponent.getRenderComponentFor)(this);
			this.renderedComponents = [];
		},
		willDestroyElement: function willDestroyElement() {
			this._super.apply(this, arguments);

			this.destroyChildComponents();
		},
		click: function click(event) {
			var $anchor = $(event.target).closest('a'),
			    label = this.getTrackingEventLabel($anchor);

			if (label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'article',
					label: label
				});
			}
		},


		actions: {
			/**
    * @param {string} title
    * @param {number} sectionIndex
    * @returns {void}
    */
			edit: function edit(title, sectionIndex) {
				this.sendAction('edit', title, sectionIndex);
			}
		},

		/**
   * This is due to the fact that we send whole article
   * as an HTML and then we have to modify it in the DOM
   *
   * Ember+Glimmer are not fan of this as they would like to have
   * full control over the DOM and rendering
   *
   * In perfect world articles would come as Handlebars templates
   * so Ember+Glimmer could handle all the rendering
   *
   * @param {string} content - HTML containing whole article
   * @returns {void}
   */
		hackIntoEmberRendering: function hackIntoEmberRendering(content) {
			this.$().html(content);
		},


		/**
   * Native browser implementation of location hash often gets clobbered by custom rendering,
   * so ensure it happens here.
   *
   * @returns {void}
   */
		handleJumpLink: function handleJumpLink() {
			if (window.location.hash) {
				window.location.assign(window.location.hash);
			}
		},


		/**
   * @param {jQuery[]} $element — array of jQuery objects of which context is to be checked
   * @returns {string}
   */
		getTrackingEventLabel: function getTrackingEventLabel($element) {
			if ($element && $element.length) {

				// Mind the order -- 'figcaption' check has to be done before '.article-image',
				// as the 'figcaption' is contained in the 'figure' element which has the '.article-image' class.
				if ($element.closest('.portable-infobox').length) {
					return 'portable-infobox-link';
				} else if ($element.closest('.context-link').length) {
					return 'context-link';
				} else if ($element.closest('blockquote').length) {
					return 'blockquote-link';
				} else if ($element.closest('figcaption').length) {
					return 'caption-link';
				} else if ($element.closest('.article-image').length) {
					return 'image-link';
				}

				return 'regular-link';
			}

			return '';
		},


		/**
   * @returns {void}
   */
		destroyChildComponents: function destroyChildComponents() {
			this.renderedComponents.forEach(function (renderedComponent) {
				renderedComponent.destroy();
			});

			this.renderedComponents.length = 0;
		},


		/**
   * Creating components for small icons isn't good solution because of performance overhead
   * Putting all icons in HTML isn't good solution neither because there are articles with a lot of them
   * Thus we load them all after the article is rendered
   *
   * @returns {void}
   */
		loadIcons: function loadIcons() {
			this.$('.article-media-icon[data-src]').each(function () {
				this.src = this.getAttribute('data-src');
			});
		},


		/**
   * @param {Node} placeholder
   * @param {number} section
   * @param {string} sectionId
   * @returns {JQuery}
   */
		renderArticleContributionComponent: function renderArticleContributionComponent(placeholder, section, sectionId) {
			this.renderedComponents.push(this.renderComponent({
				name: 'article-contribution',
				attrs: {
					section: section,
					sectionId: sectionId,
					title: this.get('displayTitle'),
					edit: this.get('edit'),
					editIconVisible: this.get('editIconVisible'),
					editAllowed: this.get('editAllowed')
				},
				element: placeholder
			}));
		},


		/**
   * @returns {void}
   */
		createContributionButtons: function createContributionButtons() {
			var _this2 = this;

			if (this.get('contributionEnabled')) {
				var headers = this.$('h2[section]').map(function (i, element) {
					if (element.textContent) {
						return {
							element: element,
							level: element.tagName,
							name: element.textContent,
							id: element.id,
							section: element.getAttribute('section')
						};
					}
				}).toArray();

				headers.forEach(function (header) {
					var $placeholder = $('<div>');

					_this2.$(header.element).wrapInner('<div class="section-header-label"></div>').append($placeholder);

					_this2.renderArticleContributionComponent($placeholder.get(0), header.section, header.id);
				});
			}
		},


		/**
   * @returns {void}
   */
		createTableOfContents: function createTableOfContents() {
			var $firstInfobox = this.$('.portable-infobox').first(),
			    $placeholder = $('<div />');

			if ($firstInfobox.length) {
				$placeholder.insertAfter($firstInfobox);
			} else {
				$placeholder.prependTo(this.$());
			}

			this.renderedComponents.push(this.renderComponent({
				name: 'article-table-of-contents',
				attrs: {
					articleContent: this.$()
				},
				element: $placeholder.get(0)
			}));
		},


		/**
   * @returns {void}
   */
		replaceInfoboxesWithInfoboxComponents: function replaceInfoboxesWithInfoboxComponents() {
			var _this3 = this;

			/**
    * @param {number} i
    * @param {Element} element
    * @returns {void}
    */
			this.$('.portable-infobox').map(function (i, element) {
				_this3.renderedComponents.push(_this3.renderComponent({
					name: 'portable-infobox',
					attrs: {
						infoboxHTML: element.innerHTML,
						height: $(element).outerHeight(),
						pageTitle: _this3.get('displayTitle'),
						smallHeroImage: _this3.get('featuredVideo') && _this3.get('heroImage'),
						openLightbox: _this3.get('openLightbox')
					},
					element: element
				}));
			});
		},


		/**
   * @returns {void}
   */
		replaceWikiaWidgetsWithComponents: function replaceWikiaWidgetsWithComponents() {
			var _this4 = this;

			/**
    * @param {number} i
    * @param {Element} element
    * @returns {void}
    */
			this.$('[data-wikia-widget]').map(function (i, element) {
				_this4.replaceWikiaWidgetWithComponent(element);
			});
		},


		/**
   * @param {Element} element
   * @returns {void}
   */
		replaceWikiaWidgetWithComponent: function replaceWikiaWidgetWithComponent(element) {
			var widgetData = $(element).data(),
			    widgetType = widgetData.wikiaWidget,
			    componentName = this.getWidgetComponentName(widgetType);

			if (componentName) {
				this.renderedComponents.push(this.renderComponent({
					name: componentName,
					attrs: {
						data: widgetData
					},
					element: element
				}));
			}
		},


		/**
   * @param {string} widgetType
   * @returns {string|null}
   */
		getWidgetComponentName: function getWidgetComponentName(widgetType) {
			var componentName = void 0;

			switch (widgetType) {
				case 'twitter':
					componentName = 'widget-twitter';
					break;
				case 'vk':
					componentName = 'widget-vk';
					break;
				case 'polldaddy':
					componentName = 'widget-polldaddy';
					break;
				case 'flite':
					componentName = 'widget-flite';
					break;
				case 'apester':
					componentName = 'widget-apester';
					break;
				case 'playbuzz':
					componentName = 'widget-playbuzz';
					break;
				default:
					this.get('logger').warn('Can\'t create widget with type \'' + widgetType + '\'');
					return null;
			}

			return componentName;
		},


		/**
   * @returns {void}
   */
		handleWikiaWidgetWrappers: function handleWikiaWidgetWrappers() {
			this.$('script[type="x-wikia-widget"]').each(function () {
				var $this = $(this);

				$this.replaceWith($this.html());
			});
		},


		/**
   * handles expanding long tables, code taken from WikiaMobile
   *
   * @returns {void}
   */
		handleInfoboxes: function handleInfoboxes() {
			var shortClass = 'short',
			    $infoboxes = this.$('table[class*="infobox"] tbody'),
			    body = window.document.body,
			    scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

			if ($infoboxes.length) {
				$infoboxes.filter(function () {
					return this.rows.length > 6;
				}).addClass(shortClass).append('<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon">' + '<use xlink:href="#chevron"></use></svg></td></tr>').on('click', function (event) {
					var $target = $(event.target),
					    $this = $(this);

					if (!$target.is('a') && $this.toggleClass(shortClass).hasClass(shortClass)) {
						scrollTo.apply($this.find('.infobox-expand')[0]);
					}
				});
			}
		},


		/**
   * @returns {void}
   */
		handleTables: function handleTables() {
			var _this5 = this;

			this.$('table:not([class*=infobox], .dirbox, .pi-horizontal-group)').not('table table').each(function (index, element) {
				var $element = _this5.$(element),
				    wrapper = '<div class="article-table-wrapper' + (element.getAttribute('data-portable') ? ' portable-table-wrappper' : '') + '"/>';

				$element.wrap(wrapper);
			});
		}
	});
});