/**
 * Library to lazy initialize components of a web page
 *
 * @example
 * sloth({
 * 		on: document.getElementById('lazyModule'),
 * 		callback: function(element){
 * 			element.innerHTML = ajax('/get/some/stuff');
 * 		}
 * });
 *
 * @author Hakubo bukaj.kelo<@gmail.com>
 * @see https://github.com/hakubo/Sloth
 */
'use strict';

interface Window {
	scrollY: number;
}

module W {
	var slice = Array.prototype.slice,
		debounce = (function ( element ) {
			return element ? parseInt( element.getAttribute( 'data-sloth-debounce' ), 10 ) : 200;
		})( window.document.querySelector( 'script[data-sloth-debounce]' ));

	export class Branch {
		private element;
		private threshold;
		callback: Function;

		constructor (element: HTMLElement, threshold: number, callback: Function) {
			this.element = element;
			this.threshold = threshold;
			this.callback = () => callback( this.element );
		}

		isVisible (visibleBottom: number, visibleTop: number): boolean {
			var elem = this.element,
				mayBeVisible = elem.scrollHeight || elem.scrollWidth,
				height,
				threshold,
				top,
				bottom;

			if ( mayBeVisible ) {
				threshold = this.threshold;
				height = elem.offsetHeight;
				top = (elem.offsetTop || elem.y) - threshold;
				bottom = top + height + threshold;

				return visibleBottom >= top && visibleTop <= bottom;
			}

			return false;
		}

		compare ( element: HTMLElement ): boolean {
			return this.element === element;
		}
	}

	export class Sloth {
		wTop: number;
		wBottom: number;
		undef;
		branches: Branch[] = [];
		lock = 0;

		addEvent () {
			window.addEventListener( 'scroll', () => this.execute() );
		}

		removeEvent () {
			window.removeEventListener( 'scroll', () => this.execute() );
		}

		drop () {
			this.branches = [];
		}

		execute ( force: boolean = false ): void {
			var i = this.branches.length,
				branch;

			if ( debounce ) {
				this.removeEvent();
			}

			if ( i && ( force || !this.lock ) ) {
				if ( debounce ) {

					this.lock = setTimeout( () => {
						this.lock = 0;
						this.addEvent();
					}, debounce );
				}

				// in IE10 window.scrollY doesn't work
				// but window.pageYOffset is basically the same
				// https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
				this.wTop = window.scrollY || window.pageYOffset;
				this.wBottom = this.wTop + window.innerHeight;

				while ( i-- ) {
					branch = this.branches[i];

					if ( branch.isVisible( this.wBottom, this.wTop ) ) {
						setTimeout( branch.callback, 0 );
						this.branches.splice( i, 1 );
					}
				}
			}
		}

		attach( params ) {
			if ( params ) {
				var elements = params.on,
					prune = params.off,
					threshold = params.threshold !== this.undef ? params.threshold : 100,
					callback = params.callback,
					i;

				if ( elements && callback ) {
					if ( elements.length !== this.undef ) {
						elements = slice.call( elements );
						i = elements.length;

						while ( i-- ) {
							this.branches.push( new Branch( elements[i], threshold, callback ) );
						}
					} else {
						this.branches.push( new Branch( elements, threshold, callback ) );
					}
				}

				if ( prune ) {
					if ( prune.length !== this.undef ) {
						prune = slice.call( prune );
						i = prune.length;

						while ( i-- ) {
							this.branches = this.branches.filter(( branch ) => {
								return !branch.compare( prune[i] );
							}, this);
						}
					} else {
						this.branches = this.branches.filter(( branch ) =>{
							return !branch.compare( prune );
						}, this);
					}
				}
			}

			this.execute( true );
		}
	}
}
