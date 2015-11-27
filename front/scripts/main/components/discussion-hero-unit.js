import App from '../app';
import ViewportMixin from '../mixins/viewport';

export default App.DiscussionHeroUnitComponent = Ember.Component.extend(ViewportMixin, {
	classNames: ['discussion-hero-unit'],
	contentClassNames: 'background-theme-color',
	attributeBindings: ['style'],

	overlay: false,
	style: null,

	headerImages: {
		24357: 'discussion-header-adventure-time.jpg',
		8390: 'discussion-header-cocktails.jpg',
		3035: 'discussion-header-fallout.jpg',
		119235: 'discussion-header-hawaii-five-o.jpg',
		35171: 'discussion-header-hunger-games.jpg',
		203914: 'discussion-header-one-direction.jpg',
		147: 'discussion-header-star-wars.jpg',
		750: 'discussion-header-star-wars.jpg',
		916: 'discussion-header-star-wars.jpg',
		1473: 'discussion-header-star-wars.jpg',
		1530: 'discussion-header-star-wars.jpg',
		1707: 'discussion-header-star-wars.jpg',
		3786: 'discussion-header-star-wars.jpg',
		5931: 'discussion-header-star-wars.jpg',
		280741: 'discussion-header-star-wars.jpg',
		13346: 'discussion-header-walking-dead.jpg'
	},

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.viewportChangeObserver();
	},

	/**
	 * Observes for change in visibility state of the component
	 * if it shows up and it didn't load the image style before,
	 * it constructs the style attribute with an approppriate image
	 * (This component is always loaded, but hidden in CSS for mobile res,
	 * so this will check if the browser width changed from mobile to desktop
	 * and then lazy-load the image)
	 */
	viewportChangeObserver: Ember.observer('viewportDimensions.width', function () {
		const visibleElement = this.$(':visible'),
			isShown = Boolean(visibleElement && visibleElement.length),
			image = this.get('headerImages')[Ember.get(Mercury, 'wiki.id')];

		if (!this.get('style') && isShown && image) {
			this.set('style',
				new Ember.Handlebars.SafeString(`background: #fff url(/front/images/${image}) center no-repeat;`));
			this.set('contentClassNames', 'background-alpha-theme-color');
		}
	}),
});
