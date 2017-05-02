import Ember from 'ember';
import {ooyalaAssets} from '../../modules/video-players/ooyala-v4';

const {Component} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/article-video-styles',
	styles: ooyalaAssets.styles
});
