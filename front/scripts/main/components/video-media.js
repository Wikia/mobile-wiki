import App from '../app';
import ImageMediaComponent from '../components/image-media';

export default App.VideoMediaComponent = ImageMediaComponent.extend({
	classNames: ['article-video'],
	layoutName: 'components/video-media',
});
