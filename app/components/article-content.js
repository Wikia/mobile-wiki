import {inject as service} from '@ember/service';
import {reads} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import $ from 'jquery';
import {on} from '@ember/object/evented';
import {run} from '@ember/runloop';
import AdsMixin from '../mixins/ads';
import {getRenderComponentFor, queryPlaceholders} from '../utils/render-component';
import getAttributesForMedia from '../utils/article-media';
import {track, trackActions} from '../utils/track';
import {inGroup} from '../modules/abtest';

/**
 * HTMLElement
 * @typedef {Object} HTMLElement
 * @property {Function} scrollIntoViewIfNeeded
 */

export default Component.extend(
	AdsMixin,
	{
		fastboot: service(),
		i18n: service(),
		logger: service(),

		tagName: 'article',
		classNames: ['article-content', 'mw-content'],
		adsContext: null,
		content: null,

		contributionEnabled: null,
		displayEmptyArticleInfo: true,
		displayTitle: null,
		isPreview: false,
		media: null,

		isFastBoot: reads('fastboot.isFastBoot'),

		adsDone: computed('adsContext', {
			get() {
				return false;
			},

			set(key, value) {
				return value;
			}
		}),

		init() {
			this._super(...arguments);

			this.renderComponent = getRenderComponentFor(this);
			this.renderedComponents = [];
		},

		/* eslint ember/no-on-calls-in-components:0 */
		didInsertElement() {
			this.destroyChildComponents();
		},

		didRender() {
			function getRandomColor() {
				var letters = '0123456789ABCDEF';
				var color = '#';
				for (var i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			}

			if (!this.get('isPreview') && this.get('adsContext') && $ && !this.get('adsDone')) {

				this.set('adsDone', true);
				console.timeEnd('ads');
				document.querySelector('.ad-slot').style.background = getRandomColor();
				document.querySelector('.ad-slot').classList.remove('hidden');
				this.setupAdsContext(this.get('adsContext'));
				// this.get('ads.module').onReady(() => {
				// 	this.injectAds();
				// });
			}
			this.handleInfoboxes();
			this.replaceInfoboxesWithInfoboxComponents();

			this.renderDataComponents(this.element);

			this.loadIcons();
			this.createContributionButtons();
			this.handleTables();
			this.replaceWikiaWidgetsWithComponents();

			if (this.get('featuredVideo') && inGroup('FEATURED_VIDEO_VIEWABILITY_VARIANTS', 'PAGE_PLACEMENT')) {
				this.renderFeaturedVideo();
			}

			this.handleWikiaWidgetWrappers();
			this.handleJumpLink();
			this.handleCollapsibleSections();
		},

		willDestroyElement() {
			this._super(...arguments);

			this.destroyChildComponents();
		},

		click(event) {
			const $anchor = $(event.target).closest('a'),
				label = this.getTrackingEventLabel($anchor);

			if (label) {
				track({
					action: trackActions.click,
					category: 'article',
					label
				});
			}
		},

		/**
		 * Native browser implementation of location hash often gets clobbered by custom rendering,
		 * so ensure it happens here.
		 *
		 * @returns {void}
		 */
		handleJumpLink() {
			if (window.location.hash) {
				window.location.assign(window.location.hash);
			}
		},

		/**
		 * @param {jQuery[]} $element — array of jQuery objects of which context is to be checked
		 * @returns {string}
		 */
		getTrackingEventLabel($element) {
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
		destroyChildComponents() {
			this.renderedComponents.forEach((renderedComponent) => {
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
		loadIcons() {
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
		renderArticleContributionComponent(placeholder, section, sectionId) {
			this.renderedComponents.push(
				this.renderComponent({
					name: 'article-contribution',
					attrs: {
						section,
						sectionId,
						title: this.get('displayTitle'),
						edit: this.get('edit'),
						editIconVisible: this.get('editIconVisible'),
						editAllowed: this.get('editAllowed'),
					},
					element: placeholder
				})
			);
		},

		/**
		 * @returns {void}
		 */
		createContributionButtons() {
			if (this.get('contributionEnabled')) {
				const headers = Array.prototype.slice.call(
					this.element.querySelectorAll('h2[section]')
				).map((element) => {
					if (element.textContent) {
						return {
							element,
							level: element.tagName,
							name: element.textContent,
							id: element.id,
							section: element.getAttribute('section'),
						};
					}
				});

				headers.forEach((header) => {
					if (header) {
						const placeholder = document.createElement('div'),
							sectionHeaderLabel = header.element.querySelector('.section-header-label');

						if (sectionHeaderLabel) {
							sectionHeaderLabel.appendChild(placeholder);
							this.renderArticleContributionComponent(placeholder, header.section, header.id);
						}
					}
				});
			}
		},

		/**
		 * @returns {void}
		 */
		replaceInfoboxesWithInfoboxComponents() {
			/**
			 * @param {number} i
			 * @param {Element} element
			 * @returns {void}
			 */
			this.$('.portable-infobox').map((i, element) => {
				this.renderedComponents.push(
					this.renderComponent({
						name: 'portable-infobox',
						attrs: {
							infoboxHTML: element.innerHTML,
							height: $(element).outerHeight(),
							pageTitle: this.get('displayTitle'),
							smallHeroImage: this.get('featuredVideo') && this.get('heroImage'),
							openLightbox: this.get('openLightbox')
						},
						element
					})
				);
			});
		},

		renderDataComponents(element) {
			this.renderedComponents = this.renderedComponents.concat(
				queryPlaceholders(element)
					.map(getAttributesForMedia, {
						openLightbox: this.get('openLightbox')
					})
					.map(this.renderComponent)
			);
		},

		/**
		 * FIXME FEATURED VIDEO A/B TEST ONLY
		 */
		renderFeaturedVideo() {
			const $infoboxes = this.$('.portable-infobox'),
				$headers = this.$(':header'),
				$placeholder = $('<div />');

			if ($infoboxes.length) {
				$infoboxes.first().after($placeholder);
			} else if ($headers.length) {
				$headers.first().after($placeholder);
			} else {
				this.get('forceFeaturedVideoVisibility')();
			}

			if ($infoboxes.length || $headers.length) {
				this.renderedComponents.push(
					this.renderComponent({
						name: 'article-featured-video',
						attrs: {
							model: this.get('featuredVideo')
						},
						element: $placeholder.get(0)
					})
				);
			}
		},

		/**
		 * @returns {void}
		 */
		replaceWikiaWidgetsWithComponents() {
			/**
			 * @param {number} i
			 * @param {Element} element
			 * @returns {void}
			 */
			this.$('[data-wikia-widget]').map((i, element) => {
				this.replaceWikiaWidgetWithComponent(element);
			});
		},

		/**
		 * @param {Element} element
		 * @returns {void}
		 */
		replaceWikiaWidgetWithComponent(element) {
			const widgetData = $(element).data(),
				widgetType = widgetData.wikiaWidget,
				componentName = this.getWidgetComponentName(widgetType);

			if (componentName) {
				this.renderedComponents.push(
					this.renderComponent({
						name: componentName,
						attrs: {
							data: widgetData
						},
						element
					})
				);
			}
		},

		/**
		 * @param {string} widgetType
		 * @returns {string|null}
		 */
		getWidgetComponentName(widgetType) {
			let componentName;

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
					this.get('logger').warn(`Can't create widget with type '${widgetType}'`);
					return null;
			}

			return componentName;
		},

		/**
		 * @returns {void}
		 */
		handleWikiaWidgetWrappers() {
			this.$('script[type="x-wikia-widget"]').each(function () {
				const $this = $(this);

				$this.replaceWith($this.html());
			});
		},

		/**
		 * handles expanding long tables, code taken from WikiaMobile
		 *
		 * @returns {void}
		 */
		handleInfoboxes() {
			const shortClass = 'short',
				$infoboxes = this.$('table[class*="infobox"] tbody'),
				body = window.document.body,
				scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

			if ($infoboxes.length) {
				$infoboxes
					.filter(function () {
						return this.rows.length > 6;
					})
					.addClass(shortClass)
					.append(
						`<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon">` +
						`<use xlink:href="#chevron"></use></svg></td></tr>`
					)
					.on('click', function (event) {
						const $target = $(event.target),
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
		handleTables() {
			this.$('table:not([class*=infobox], .dirbox, .pi-horizontal-group)')
				.not('table table')
				.not('.article-table-wrapper table')
				.each((index, element) => {
					const $element = this.$(element),
						wrapper = `<div class="article-table-wrapper${element.getAttribute('data-portable') ?
							' portable-table-wrappper' : ''}"/>`;

					$element.wrap(wrapper);
				});
		},

		handleCollapsibleSectionHeaderClick(event) {
			const header = event.currentTarget,
				section = header.nextElementSibling;
			let visible = 'false';

			if (header.classList.contains('open-section')) {
				header.classList.remove('open-section');
			} else {
				header.classList.add('open-section');
				visible = 'true';

				if (!header.hasAttribute('data-rendered')) {
					this.renderDataComponents(section);
					header.setAttribute('data-rendered', '');
				}
			}

			section.setAttribute('aria-pressed', visible);
			section.setAttribute('aria-expanded', visible);
		},

		handleCollapsibleSections() {
			Array.prototype.slice.call(this.element.querySelectorAll('h2[section]'))
				.forEach((header) => header.addEventListener('click', this.handleCollapsibleSectionHeaderClick.bind(this)));
		}
	}
);
