import { Promise } from 'rsvp';

let fpPromise = null;

/**
  * Creates a version string for cache busting
  *
  * @returns {string}
  */
function version() {
  // Use number of hours passed since Jan. 1, 1970. That way cache is busted at most every hour.
  return Math.floor((new Date()).getTime() / (60 * 60 * 1000));
}

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
      if (window.fandomEmbeddedFeeds) {
        resolve(window.fandomEmbeddedFeeds);
      } else {
        reject();
      }
    };
    fpScript.onerror = () => {
      reject();
    };
    fpScript.src = `/feeds-and-posts/public/dist/lib.min.js?${version()}`;
    document.querySelector('head').appendChild(fpScript);
  });

  return fpPromise;
}

/**
  * Loads the feed onto an article page
  *
  * @param {Module} module
  * @param {Object} [options]
  */
function loadFeed(module, options = {}) {
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
  module.default(container, options);
}

export default {
  getModule,
  loadFeed,
};
