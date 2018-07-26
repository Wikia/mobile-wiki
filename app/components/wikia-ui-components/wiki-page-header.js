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
 */

import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { track, trackActions } from '../../utils/track';
import HeroImage from '../../modules/hero-image';
import Thumbnailer from '../../modules/thumbnailer';

export default Component.extend(
	{
		wikiVariables: service(),
		classNames: ['wiki-page-header'],
		classNameBindings: ['heroImage:has-hero-image'],
		isMainPage: false,
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

		style: computed('heroImage', function () {
			const heroImage = this.heroImage;

			if (isEmpty(heroImage)) {
				return '';
			}

			const mode = heroImage.width >= 300 ? Thumbnailer.mode.topCrop : Thumbnailer.mode.fixedAspectRatio,
				heroImageHelper = new HeroImage(heroImage, mode);

			return htmlSafe(`background-image: url(${heroImageHelper.thumbnailUrl}); height: ${heroImageHelper.computedHeight}px;`); // eslint-disable-line max-len
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
