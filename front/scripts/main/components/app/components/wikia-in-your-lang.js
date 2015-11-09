App.WikiaInYourLangComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.LanguagesMixin,
	{
		alertKey: 'wikiaInYourLang.alertDismissed',

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.handleWikiaInYourLang();
		},

		/**
		 * @returns {void}
		 */
		handleWikiaInYourLang() {
			if (this.shouldShowWikiaInYourLang()) {
				App.WikiaInYourLangModel.load()
					.then((model) => {
						if (model) {
							this.createAlert(model);
							M.track({
								action: M.trackActions.impression,
								category: 'wikiaInYourLangAlert',
								label: 'shown',
							});
						}
					}, (err) => {
						M.track({
							action: M.trackActions.impression,
							category: 'wikiaInYourLangAlert',
							label: err || 'error',
						});
					});
			}
		},

		/**
		 * @param {App.WikiaInYourLangModel} model
		 * @returns {void}
		 */
		createAlert(model) {
			const alertData = {
				message: model.message,
				expiry: 60000,
				unsafe: true,
				callbacks: {
					onInsertElement: (alert) => {
						alert.on('click', 'a:not(.close)', () => {
							M.track({
								action: M.trackActions.click,
								category: 'wikiaInYourLangAlert',
								label: 'link',
							});
						});
					},
					onCloseAlert: () => {
						window.localStorage.setItem(this.get('alertKey'), new Date().getTime().toString());
						M.track({
							action: M.trackActions.click,
							category: 'wikiaInYourLangAlert',
							label: 'close',
						});
					},
				},
			};

			this.addAlert(alertData);
		},

		/**
		 * @returns {boolean}
		 */
		shouldShowWikiaInYourLang() {
			const value = window.localStorage.getItem(this.get('alertKey')),
				now = new Date().getTime(),
				/**
				 * 2,592,000,000 = 30 days
				 */
				notDismissed = !value || (now - value > 2592000000),
				isJaOnNonJaWikia = this.get('isJapaneseBrowser') && !this.get('isJapaneseWikia');

			return notDismissed && isJaOnNonJaWikia;
		},
	}
);
