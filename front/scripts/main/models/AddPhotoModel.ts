/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury" />
/// <reference path="../mixins/EditMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';

App.AddPhotoModel = Em.Object.extend({
	title: null,
	sectionIndex: null,
	photoData: null,
	photoImage: null,
	photoName: null,
	photoExtension: null
});

interface FileNameSeparated {
    name: string;
    extension: string;
}

App.AddPhotoModel.separateFileNameAndExtension = function(fileName: string): FileNameSeparated {
	var name = fileName.substr(0, fileName.lastIndexOf('.')),
	    extension = fileName.substr(fileName.lastIndexOf('.') + 1),
	    fileNameSeparated: FileNameSeparated = { name: name, extension: extension };
	return fileNameSeparated;
};

App.AddPhotoModel.reopenClass(App.EditMixin, {
	load: function(title: string, sectionIndex: number, photoData: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var oFReader = new FileReader();
			oFReader.readAsDataURL(photoData);
			oFReader.onload = function(oFREvent: any): void {
				var separatedName = App.AddPhotoModel.separateFileNameAndExtension(photoData.name),
				photoName = separatedName.name,
				photoExtension = separatedName.extension;
				resolve(
					App.AddPhotoModel.create({
						title: title,
						sectionIndex: sectionIndex,
						photoData: photoData,
						photoImage: oFREvent.target.result,
						photoName: photoName,
						photoExtension: photoExtension
					})
				);
			};
			oFReader.onerror = function(OFREvent: any): void {
				reject();
			};
		});
	},

	addToContent: function(uploadedPhotoTitle: any, model: any): Em.RSVP.Promise {
		var photoWikiText = '\n[[File:' + uploadedPhotoTitle + '|thumb]]\n',
			editData = {
				action: 'edit',
				title: model.title,
				section: model.sectionIndex,
				format: 'json',
				appendtext: photoWikiText, //For now, we always add image file at the bottom of section.
				token: ''
			};
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			this.getEditToken(model.title)
				.then((token: any): void => {
					editData.token = token;
					this.editContent(editData)
						.then(resolve, reject);
				}, (err: any) => {
					reject(err);
				});
		});
	},

	editContent: function(editData: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({ path: '/api.php' }),
				dataType: 'json',
				method: 'POST',
				data: editData,
				success: (resp: any): void => {
					if (resp && resp.edit && resp.edit.result === 'Success') {
						resolve();
					} else if (resp && resp.error) {
						reject(resp.error.code);
					} else {
						reject();
					}
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	},

	upload: function(model: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			this.temporaryUpload(model.photoData)
				.then((addmediatemporary: any): void => {
					if (addmediatemporary.tempName === undefined) { //we already have the file. No need to upload.
						return resolve({'title': addmediatemporary.title});
					}
					//If a user inputs an empty image name, then we silently replace it with original file name.
					var newPhotoTitle;
					if (model.photoName.trim().length === 0) {
						newPhotoTitle = model.photoData.name;
					} else {
						newPhotoTitle = model.photoName.trim() + '.' + model.photoExtension;
					}
					this.permanentUpload(newPhotoTitle, addmediatemporary.tempName)
						.then(resolve, reject);
				}, (err: any) => {
					reject(err);
				});
		});
	},

	permanentUpload: function(photoTitle: string, tempName: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var params = {
				action: 'addmediapermanent',
				format: 'json',
				title: photoTitle,
				tempName: tempName
			};
			Em.$.ajax({
				url: M.buildUrl({ path: '/api.php' }),
				method: 'POST',
				data: params,
				success: (resp: any): void => {
					if (resp && resp.addmediapermanent) {
						resolve(resp.addmediapermanent);
					} else if (resp && resp.error) {
						reject(resp.error.code);
					} else {
						reject();
					}
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	},

	temporaryUpload: function(photoData: any): Em.RSVP.Promise {
		var formData = new FormData();
		formData.append('file', photoData);

		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
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
				success: (resp: any): void => {
					if (resp && resp.addmediatemporary) {
						resolve(resp.addmediatemporary);
					} else if (resp && resp.error) {
						reject(resp.error.code);
					} else {
						reject();
					}
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	}
});
