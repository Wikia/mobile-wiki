import Ember from 'ember';
import config from '../../config/environment';

const {Component} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/article-video-styles',
	styles: config.ooyala.styles
});
