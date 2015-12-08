import App from '../app';
import ArticleEditMixin from '../mixins/article-edit';

/**
 * @typedef {Object} FileNameSeparated
 * @property {string} name
 * @property {string} extension
 */

export default App.ArticleAddPhotoModel = Ember.Object.extend({
	title: null,
	sectionIndex: null,
	photoData: null,
	photoImage: null,
	photoName: null,
	photoExtension: null
});

/**
 * @param {string} fileName
 * @returns {FileNameSeparated}
 */
App.ArticleAddPhotoModel.separateFileNameAndExtension = (fileName) => {
	const name = fileName.substr(0, fileName.lastIndexOf('.')),
		extension = fileName.substr(fileName.lastIndexOf('.') + 1);

	return {
		name,
		extension
	};
};

App.ArticleAddPhotoModel.reopenClass(
	ArticleEditMixin,
	{
		/**
		 * @param {*} photoData
		 * @returns {Ember.RSVP.Promise}
		 */
		load(photoData) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const oFReader = new FileReader();

				oFReader.readAsDataURL(photoData);
				oFReader.onload = function (oFREvent) {
					const separatedName = App.ArticleAddPhotoModel.separateFileNameAndExtension(photoData.name),
						photoName = separatedName.name,
						photoExtension = separatedName.extension;

					resolve(
						App.ArticleAddPhotoModel.create({
							photoData,
							photoImage: oFREvent.target.result,
							photoName,
							photoExtension
						})
					);
				};
				oFReader.onerror = function () {
					reject();
				};
			});
		},

		/**
		 * @param {*} uploadedPhotoTitle
		 * @param {*} model
		 * @returns {Ember.RSVP.Promise}
		 */
		addToContent(uploadedPhotoTitle, model) {
			const photoWikiText = `\n[[File:${uploadedPhotoTitle}|thumb]]\n`,
				editData = {
					action: 'edit',
					title: model.title,
					section: model.sectionIndex,
					format: 'json',
					// For now, we always add image file at the bottom of section.
					appendtext: photoWikiText,
					token: ''
				};

			return new Ember.RSVP.Promise((resolve, reject) => {
				this.getEditToken(model.title)
					.then((token) => {
						editData.token = token;
						this.editContent(editData)
							.then(resolve, reject);
					}, (err) => reject(err));
			});
		},

		editContent(editData) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				Ember.$.ajax({
					url: M.buildUrl({path: '/api.php'}),
					dataType: 'json',
					method: 'POST',
					data: editData,
					success: (resp) => {
						if (resp && resp.edit && resp.edit.result === 'Success') {
							resolve();
						} else if (resp && resp.error) {
							reject(resp.error.code);
						} else {
							reject();
						}
					},
					error: (err) => reject(err)
				});
			});
		},

		/**
		 * @param {*} model
		 * @returns {Ember.RSVP.Promise}
		 */
		upload(model) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				this.temporaryUpload(model.photoData)
					.then((addMediaTemporary) => {
						let newPhotoTitle;

						// We already have the file. No need to upload.
						if (typeof addMediaTemporary.tempName === 'undefined') {
							resolve(addMediaTemporary);
							return;
						}

						// If a user inputs an empty image name, then we silently replace it with original file name.
						if (model.photoName.trim().length === 0) {
							newPhotoTitle = model.photoData.name;
						} else {
							newPhotoTitle = `${model.photoName.trim()}.${model.photoExtension}`;
						}

						this.permanentUpload(newPhotoTitle, addMediaTemporary.tempName)
							.then(resolve, reject);
					}, (err) => reject(err));
			});
		},

		/**
		 * @param {string} title
		 * @param {string} tempName
		 * @returns {Ember.RSVP.Promise}
		 */
		permanentUpload(title, tempName) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const params = {
					action: 'addmediapermanent',
					format: 'json',
					title,
					tempName
				};

				Ember.$.ajax({
					url: M.buildUrl({path: '/api.php'}),
					method: 'POST',
					data: params,
					success: (resp) => {
						if (resp && resp.addmediapermanent) {
							resolve(resp.addmediapermanent);
						} else if (resp && resp.error) {
							reject(resp.error.code);
						} else {
							reject();
						}
					},
					error: (err) => reject(err)
				});
			});
		},

		/**
		 * @param {*} photoData
		 * @returns {Ember.RSVP.Promise}
		 */
		temporaryUpload(photoData) {
			const formData = new FormData();

			formData.append('file', photoData);

			return new Ember.RSVP.Promise((resolve, reject) => {
				Ember.$.ajax({
					url: M.buildUrl({
						path: '/api.php',
						query: {
							action: 'addmediatemporary',
							format: 'json'
						}
					}),
					method: 'POST',
					data: formData,
					cache: false,
					xhrFields: {
						withCredentials: true
					},
					contentType: false,
					processData: false,
					success: (resp) => {
						if (resp && resp.addmediatemporary) {
							resolve(resp.addmediatemporary);
						} else if (resp && resp.error) {
							reject(resp.error.code);
						} else {
							reject();
						}
					},
					error: (err) => reject(err)
				});
			});
		}
	}
);
