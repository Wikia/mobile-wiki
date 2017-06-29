import Ember from 'ember';

const {
	Object: EmberObject
} = Ember;

export default EmberObject.extend(
	{
		title: 'TITLE',
		posts: [{
			title: 'Facebook Gives Fans a Harry Potter Easter Egg and They\'re Going Crazy For It',
			url: 'http://fandom.wikia.com/articles/facebook-gives-fans-a-harry-potter-easter-egg-and-theyre-going-crazy-for-it',
			image_url: 'https://vignette.wikia.nocookie.net/927bbe5e-6d8c-4f8c-88f5-69b848eaa3db/scale-to-width-down/400'
		}]
	}
);
