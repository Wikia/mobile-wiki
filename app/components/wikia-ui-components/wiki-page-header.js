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

import {inject as service} from '@ember/service';
import {reads} from '@ember/object/computed';
import Component from '@ember/component';
import {htmlSafe} from '@ember/string';
import {computed} from '@ember/object';
import {isEmpty} from '@ember/utils';
import ViewportMixin from '../../mixins/viewport';
import {thumbSize} from '../../utils/thumbnail';
import {track, trackActions} from '../../utils/track';
import HeroImage from '../../modules/hero-image';

export default Component.extend(
	ViewportMixin,
	{
		fastboot: service(),
		wikiVariables: service(),
		classNames: ['wiki-page-header'],
		classNameBindings: ['heroImage:has-hero-image', 'fastboot.isFastBoot:is-fastboot'],
		attributeBindings: ['style'],
		isMainPage: false,
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

		style: computed('heroImage', 'viewportDimensions.width', function () {
			const heroImage = this.get('heroImage'),
				windowWidth = this.get('viewportDimensions.width');

			if (isEmpty(heroImage)) {
				return '';
			}

			if (this.get('fastboot.isFastBoot')) {
				// We display brackets placeholder as the background using .is-fastboot class
				return htmlSafe(`height: ${thumbSize.medium}px`);
			}

			const heroImageHelper = new HeroImage(heroImage, windowWidth);

			return htmlSafe(`background-image: url(${heroImageHelper.thumbnailUrl}); height: ${heroImageHelper.computedHeight}px`); // eslint-disable-line max-len
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
