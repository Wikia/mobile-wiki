/**
 * Wiki Page Header reusable component usage:
 *
 * @example
 * {{wikia-ui-components/wiki-page-header isMainPage=true}}
 *
 * @example
 * {{wikia-ui-components/wiki-page-header title=<title>}}
 *
 * @example
 * {{wikia-ui-components/wiki-page-header
 *   title=<title>
 *   subtitle=<subtitle>
 *   heroImage=<hero image url>}}
 *
 * @example
 * {{#wikia-ui-components/wiki-page-header isMainPage=true}}
 *   {{#link-to '<route>' trackingCategory='<category>' trackingLabel='<label>' bubbles=false}}
 *     {{svg 'pencil' role='img' class='icon pencil'}}
 *   {{/link-to}}
 * {{/wikia-ui-components/wiki-page-header}}
 */

import Ember from 'ember';
import ViewportMixin from '../../mixins/viewport';
import {thumbSize} from '../../utils/thumbnail';
import {track, trackActions} from '../../utils/track';
import HeroImage from '../../modules/hero-image';

const {
	Component,
	String: {htmlSafe},
	computed,
	inject,
	isEmpty
} = Ember;

export default Component.extend(
	ViewportMixin,
	{
		fastboot: inject.service(),
		wikiVariables: inject.service(),
		classNames: ['wiki-page-header'],
		classNameBindings: ['heroImage:has-hero-image', 'fastboot.isFastBoot:is-fastboot'],
		attributeBindings: ['style'],
		isMainPage: false,
		siteName: computed.reads('wikiVariables.siteName'),
		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),

		style: computed('heroImage', 'viewportDimensions.width', function () {
			const heroImage = this.get('heroImage'),
				windowWidth = this.get('viewportDimensions.width');

			if (isEmpty(heroImage)) {
				return '';
			}

			if (this.get('fastboot.isFastBoot')) {
				// We display brackets placeholder as the background using .is-fastboot class
				return new htmlSafe(`height: ${thumbSize.medium}px`);
			}

			const heroImageHelper = new HeroImage(heroImage, windowWidth);

			return new htmlSafe(`background-image: url(${heroImageHelper.thumbnailUrl}); height: ${heroImageHelper.computedHeight}px`);
		}),

		actions: {
			trackClick() {
				track({
					action: trackActions.click,
					category: 'wikiname',
					label: ''
				});
			}
		}
	}
);
