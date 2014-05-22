/// <reference path="./thumbnailer.ts" />
/// <reference path="../../../definitions/jquery/jquery.d.ts" />
/**
 * @define lazyload
 *
 * Image lazy loading
 */
'use strict';

module W {
	export class Lazyload {
		pageContent: HTMLElement;
		pageWidth: number;

		constructor () {
			this.pageContent = $('.page-wrapper')[0];
			this.pageWidth = this.pageContent.offsetWidth;

			window.addEventListener( 'viewportsize', ( ev ) => {
				this.pageWidth = this.pageContent.offsetWidth;
			} );
		}

		onLoad ( img: HTMLImageElement, background: boolean ): Function {
			return function() {
				var url = this.src;
				img.className += ' load';

				setTimeout( () => {
					Lazyload.displayImage( img, url, background );
				}, 250 );
			};
		}

		static displayImage ( img: HTMLImageElement, url: string, background: boolean ): void {
			if ( background ) {
				img.style.backgroundImage = 'url(' + url + ')';
			} else {
				img.src = url;
			}

			img.className += ' loaded';
		}

		load ( elements: NodeList, background: boolean ) {
			var i = 0,
				elm,
				img,
				src,
				elementsArray = $.makeArray( elements );

			while ( elm = elementsArray[i++] ) {
				img = new Image();
				src = elm.getAttribute( 'data-src' );

				if ( src ) {
					if ( elm.className.indexOf( 'getThumb' ) > -1 && !W.Thumbnailer.isThumbUrl( src ) ) {
						src = W.Thumbnailer.getThumbURL( src, 'nocrop', '660', '330' );
					}

					img.src = src;

					//don't do any animation if image is already loaded
					if ( img.complete ) {
						Lazyload.displayImage( elm, src, background );
					} else {
						img.onload = this.onLoad( elm, background );
					}
				}
			}
		}

		fixSizes ( elements: NodeList ) {
			var i = 0,
				elm,
				imageWidth,
				elementsArray = $.makeArray( elements );

			while ( elm = elementsArray[i++] ) {
				imageWidth = ~~elm.getAttribute( 'width' );

				if ( this.pageWidth < imageWidth ) {
					elm.setAttribute( 'height', Math.round( elm.width * ( ~~elm.getAttribute( 'height' ) / imageWidth) ) );
				}
			}
		}
	}
}
