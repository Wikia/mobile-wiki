import { Promise } from 'rsvp';

let fpPromise = null;

/**
 * Gets the Feeds & Posts ES Module, by first appending the F&P library to the page
 *
 * @returns {Promise} Promise of module
 */
function getModule() {
	if (fpPromise) {
		return fpPromise;
	}

	fpPromise = new Promise((resolve, reject) => {
		const fpScript = document.createElement('script');
		fpScript.onload = () => {
			resolve(window.fp);
		};
		fpScript.onerror = () => {
			reject();
		};
		fpScript.src = '/feeds-and-posts/public/dist/lib.min.js';
		document.querySelector('head').appendChild(fpScript);
	});

	return fpPromise;
}

/**
 * Loads the feed onto an article page
 *
 * @param {Module} module
 */
function loadFeed(module) {
	const container = document.createElement('div');
	container.setAttribute('class', 'feed-posts-module');

	// First try inserting before the first collapsed H2 in the article content
	let insertBeforeNode = document.querySelector('.article-content h2[section]');
	// Then try before the article footer
	if (!insertBeforeNode) {
		insertBeforeNode = document.querySelector('.article-footer');
	}
	// If that doesn't exist, do nothing
	if (!insertBeforeNode) {
		return;
	}

	insertBeforeNode.parentNode.insertBefore(container, insertBeforeNode);
	module.default(container);
}

export default {
	getModule,
	loadFeed,
};
