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
import {track, trackActions} from '../../utils/track';
import HeroImage from '../../modules/hero-image';
import {MAX_WIDTH} from '../../modules/hero-image';
import Thumbnailer from '../../modules/thumbnailer';

export default Component.extend(
	{
		wikiVariables: service(),
		classNames: ['wiki-page-header'],
		classNameBindings: ['heroImage:has-hero-image'],
		attributeBindings: ['style'],
		isMainPage: false,
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

		style: computed('heroImage', function () {
			const heroImage = this.get('heroImage');

			if (isEmpty(heroImage)) {
				return '';
			}

			const mode = heroImage.width >= 300 ? Thumbnailer.mode.topCrop : Thumbnailer.mode.fixedAspectRatio,
				heroImageHelper = new HeroImage(heroImage, MAX_WIDTH, mode);

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
