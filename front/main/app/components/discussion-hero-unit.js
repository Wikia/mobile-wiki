import Ember from 'ember';
import DiscussionEditImage from '../mixins/discussion-edit-image';
import {track, trackActions} from '../utils/discussion-tracker';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	DiscussionEditImage,
	ViewportMixin,
	{
		classNames: ['discussion-hero-unit', 'draggable-dropzone'],
		contentClassNames: 'background-theme-color',

		headerTitle: i18n.t('main.discussions-header-title', {ns: 'discussion'}),

		overlay: false,

		canEdit: Ember.computed.and('editingPossible', 'currentUser.isAuthenticated', 'heroImage.permissions.canEdit'),
		currentUser: Ember.inject.service(),
		editingPossible: false,
		fileInputClassNames: ['upload-image-button', 'background-theme-color'],
		imageBackground: null,
		onImageUrlChange: Ember.observer('imageUrl', function () {
			this.setImageBackground(this.get('imageUrl'));
		}),
		trackedActions: {
			EditButtonTapped: trackActions.EditDiscussionsHeaderButtonTapped,
			EditEscapeKeyHit: trackActions.EditDiscussionsHeaderEscapeKeyHit,
			EditFileDropped: trackActions.EditDiscussionsHeaderFileDropped,
			EditImagePreview: trackActions.EditDiscussionsHeaderImagePreview,
			Save: trackActions.DiscussionsHeaderSave,
			SaveFailure: trackActions.DiscussionsHeaderSaveFailure
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this._super(...arguments);

			this.viewportChangeObserver();
		},

		/**
		 * @private
		 */
		setImageBackground(imageUrl) {
			this.set('imageBackground',
				new Ember.Handlebars.SafeString(`background: #fff url(${imageUrl}) center no-repeat;`));
		},

		/**
		 * Observes for change in visibility state of the component
		 * if it shows up and it didn't load the image before,
		 * it constructs the style attribute with an appropriate image
		 * (This component is always loaded, but hidden in CSS for mobile res,
		 * so this will check if the browser width changed from mobile to desktop
		 * and then lazy-load the image)
		 */
		viewportChangeObserver: Ember.observer('viewportDimensions.width', function () {
			const visibleElement = this.$(':visible'),
				isShown = Boolean(visibleElement && visibleElement.length);

			if (!this.get('imageBackground') && isShown) {
				if (Ember.isEmpty(this.get('heroImage.value'))) {
					const imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/brackets.svg');

					this.set('imageBackground',
						new Ember.Handlebars.SafeString(`background: #000 url(${imageUrl}) center no-repeat;`));
				} else {
					this.setImageBackground(this.get('heroImage.value'));
				}
				this.set('contentClassNames', 'background-alpha-theme-color');
			}
		})
	});
