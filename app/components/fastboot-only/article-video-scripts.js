import Component from '@ember/component';
import {ooyalaAssets} from '../../modules/video-players/ooyala-v4';

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/article-video-scripts',
	script: ooyalaAssets.script
});
