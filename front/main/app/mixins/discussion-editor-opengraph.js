import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import {getLastUrlFromText} from 'common/utils/string';

export default Ember.Mixin.create({
	isOpenGraphLoading: false,
	openGraph: null,
	showsOpenGraphCard: false,
	contentLength: 0,

	didInsertElement() {
		this._super(...arguments);

		this.$().find('textarea:last')
			.on('paste', this.onPaste.bind(this));
	},

	/**
	 * Track content changed
	 *
	 * @returns {void}
	 */
	onContentChange: Ember.observer('content', function () {
		this.handleTyping();

		let length = 0;
		if (this.get('content') !== null) {
			length = this.get('content').length;
		}

		this.set('contentLength', length);
	}),

	/**
	 * In some browsers (IE11) there's no support for event clipboard data, so there's a need to
	 * wait and then check the content of the textarea
	 *
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onPaste(event) {
		const clipboardData = Ember.get(event, 'originalEvent.clipboardData'),
			textType = 'text/plain';

		let pastedText;

		if (clipboardData && clipboardData.getData &&
			Array.prototype.slice.call(clipboardData.types).indexOf(textType) !== -1) {
			pastedText = clipboardData.getData(textType);
		}

		if (typeof pastedText === 'string' && pastedText.length) {
			const pastedUrl = getLastUrlFromText(pastedText);

			if (pastedUrl) {
				this.setOpenGraphProperties(pastedUrl);
			}
		} else {
			Ember.run.later(() => {
				const textarea = event.target,
					pastedUrl = getLastUrlFromText(
						textarea.value.substring(0, textarea.selectionEnd)
					);

				if (pastedUrl) {
					this.setOpenGraphProperties(pastedUrl);
				}
			}, 100);
		}
	},

	/**
	 * Generates OG card if there's a url to generate it for
	 *
	 * @returns {void}
	 */
	handleTyping() {
		const textarea = this.$('textarea:last').get(0);

		if (!textarea) {
			return;
		}

		const value = this.get('content');
		if (value === null) {
			return;
		}

		const lastChar = value.charCodeAt(textarea.selectionEnd - 1),
			allowedChars = [10, 13, 32];

		if (allowedChars.indexOf(lastChar) === -1 || value.length <= this.get('contentLength')) {
			return;
		}

		const url = getLastUrlFromText(value.substring(0, textarea.selectionEnd));

		// start with position of caret - url length - 1 for newly typed charatcter
		if (url && value.indexOf(url) === textarea.selectionEnd - url.length - 1) {
			this.setOpenGraphProperties(url);
		}
	},

	setOpenGraphProperties(url) {
		if (this.get('showsOpenGraphCard')) {
			return;
		}

		this.setProperties({
			isOpenGraphLoading: true,
			showsOpenGraphCard: true
		});

		this.get('generateOpenGraph')(url)
			.then((openGraph) => {
				this.setProperties({
					openGraph,
					isOpenGraphLoading: false,
				});

				track(trackActions.OGCreated);
			}).catch(() => {
				this.setProperties({
					openGraph: null,
					isOpenGraphLoading: false,
					showsOpenGraphCard: false,
				});
			});
	},

	afterSuccess() {
		this._super();

		this.setProperties({
			openGraph: null,
			showsOpenGraphCard: false,
		});
	},

	actions: {
		/**
		 * Hides open graph card and removes it's data from the editor
		 *
		 * @returns {void}
		 */
		removeOpenGraph() {
			this.setProperties({
				showsOpenGraphCard: false,
				openGraph: null,
			});

			track(trackActions.OGRemoved);
		}
	}
});
