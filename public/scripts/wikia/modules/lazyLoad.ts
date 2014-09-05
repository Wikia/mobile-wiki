/// <reference path="./thumbnailer.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/**
 * @define lazyload
 *
 * Image lazy loading
 */
'use strict';

interface DOMStringMap {
	ref: string;
}

module Wikia.Modules {
	export class LazyLoad {
		pageContent: JQuery;

		constructor() {
			this.pageContent = $('.article-content');
		}

		getPageWidth(): number {
			return this.pageContent.width();
		}

		onLoad(img: HTMLImageElement, background: boolean): (ev: Event) => any {
			return function (): void {
				LazyLoad.displayImage(img, this.src, background);
			};
		}

		static displayImage(img: HTMLImageElement, url: string, background: boolean): void {
			img.className += ' load';

			if (background) {
				img.style.backgroundImage = 'url(' + url + ')';
			} else {
				img.src = url;
			}

			img.className += ' loaded';
		}

		load(elements: any, background: boolean, media: any[]): void {
			var i: number = 0,
				elm: HTMLImageElement,
				img: HTMLImageElement,
				ref: number,
				data: {
					url: string;
				},
				elementsArray: HTMLImageElement[] = $.makeArray(elements);

			while (elm = elementsArray[i++]) {
				img = new Image();
				ref = parseInt(elm.getAttribute('data-ref'), 10);
				data = media[~~elm.dataset.ref];

				if (ref && data.url) {
					// TODO: unsure what src is supposed to be and it's currently undef
					// if (elm.className.indexOf('getThumb') > -1 && !W.Thumbnailer.isThumbUrl(data.url)) {
					// data.url = W.Thumbnailer.getThumbURL(src, 'nocrop', '660', '330');
					// }

					img.src = data.url;

					//don't do any animation if image is already loaded
					if (img.complete) {
						LazyLoad.displayImage(elm, img.src, background);
					} else {
						img.addEventListener('load', this.onLoad(elm, background));
					}
				}
			}
		}

		fixSizes(elements: NodeList) {
			var i = 0,
				elm: HTMLImageElement,
				imageWidth: number,
				elementsArray: HTMLImageElement[] = $.makeArray(elements),
				pageWidth = this.getPageWidth();

			while (elm = elementsArray[i++]) {
				imageWidth = ~~elm.getAttribute('width');

				if (pageWidth < imageWidth) {
					elm.style.height = Math.round(elm.width * (~~elm.getAttribute('height') / imageWidth)) + 'px';
				}
			}
		}
	}
}
