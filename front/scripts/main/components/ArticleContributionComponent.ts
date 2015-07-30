/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />

App.ArticleContributionComponent = Em.Component.extend({
	tagName: 'div',
	classNames: ['contribution-container'],
	routing: Ember.inject.service('-routing'),
    article: null,
    sectionIndex: null,

	articleContent: Em.computed('article', function (): any {
		return this.get('article');
	}),

	articleContentObserver: Em.observer('articleContent', function (): void {
		this.rerender();
		Em.run.scheduleOnce('afterRender', this, (): void => {
			this.setupContributionButtons();
		});
	}).on('init'),

	setupContributionButtons: function (): void {
		
		var $photoIcon = this.$('.upload-photo'),
		    $editIcon = this.$('.edit-section');

		if (this.sectionIndex === 0) { //need different html for different styling for section 0
			$photoIcon.addClass('zero');
			$editIcon.addClass('zero');
		}

		// $photoIcon
		// .on('change', () => {
		// 	this.onPhotoIconChange($photoIcon, this.sectionIndex);
		// })
		// .on('click', () => {
		// 	M.track({
		// 		action: M.trackActions.click,
		// 		category: 'sectioneditor',
		// 		label: 'addPhoto',
		// 		value: this.sectionIndex
		// 	});
		// });
		
		// $editIcon
		// .on()
		// var pencil = '<div class="edit-section"><svg class="icon pencil" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pencil"></use></svg></div>',
		//     photo = '<div class="upload-photo"><svg class="icon camera" role="img"><use xlink:href="#camera"></use></svg><input class="file-input" type="file" accept="image/*"/></div>',
		//     iconsWrapper = '<div class="icon-wrapper">' + pencil + photo + '</div>',

		// this.$(':header[section]').each((i: Number, item: any): void => {
		// 	var $sectionHeader = this.$(item);
		// 	$sectionHeader.prepend(iconsWrapper).addClass('short-header');
		// });
		// this.setupButtonsListeners();
	},

	// setupButtonsListeners: function () : void {
	// 	this.$('.article-content')
	// 		.on('click', '.pencil', (event: JQueryEventObject): void => {
	// 			var $sectionHeader = $(event.target).closest(':header[section]');
	// 			this.get('controller').send('edit', this.get('controller.model.cleanTitle'), $sectionHeader.attr('section'));
	// 		})
	// 		.on('click', '.upload-photo', (event: JQueryEventObject): void => {
	// 			var $sectionHeader = $(event.target).closest(':header[section]'),
	// 			    sectionIndex: number = parseInt($sectionHeader.attr('section'), 10);

	// 			M.track({
	// 				action: M.trackActions.click,
	// 				category: 'sectioneditor',
	// 				label: 'addPhoto',
	// 				value: sectionIndex
	// 			});
	// 		})
	// 		.on('change', '.upload-photo', (event: JQueryEventObject): void => {
	// 			var $uploadPhotoContainer = $(event.target).parent(),
	// 			    sectionIndex: number = parseInt($(event.target).closest(':header[section]').attr('section'), 10);
	// 			this.onPhotoIconChange($uploadPhotoContainer, sectionIndex);
	// 		});
	// },

	onPhotoIconChange: function(uploadPhotoContainer: JQuery, sectionNumber: number): void {
		var photoData = (<HTMLInputElement>uploadPhotoContainer.find('.file-input')[0]).files[0];
		this.get('controller').send('addPhoto', this.get('controller.model.cleanTitle'), sectionNumber, photoData);
	},

	actions: {
		edit: function (title: string): void {
			App.VisibilityStateManager.reset();
			//this.get('routing').transitionToRoute('edit', title, sectionIndex); //does not work
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.sectionIndex
			});
		},

		select: function (): void {
			console.log('qqq photo clicked');
			this.$('.file-input').click();
		},

		upload: function (): void {
			console.log('qqq photo changed');
		}
	}

});