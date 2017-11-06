import Mixin from '@ember/object/mixin';

export default Mixin.create({
	/**
	 * @param url string
	 * @returns Promise
	 */
	load(url) {
		return new Promise((resolve, reject) => {
			const image = new Image();

			image.src = url;

			if (image.complete) {
				resolve(url);
			} else {
				image.addEventListener('load', () => {
					resolve(url);
				});

				image.addEventListener('error', () => {
					reject();
				});
			}
		});
	},
});
