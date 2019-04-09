import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';

const CACHE_KEY = 'recommendations_blacklist';
const CURRENT_SESSION_KEY = (window && window.Cookies) ? window.Cookies.get('wikia_session_id') : '';
let cachedItems;

function cacheItems(items) {
  localStorageConnector.setItem(CACHE_KEY, JSON.stringify({ [CURRENT_SESSION_KEY]: items }));
}

function get() {
  if (cachedItems) {
    return cachedItems;
  }

  let cachedData;

  try {
    cachedData = JSON.parse(localStorageConnector.getItem(CACHE_KEY));
  } catch (e) {
    /* noop */
  }

  cachedItems = cachedData ? cachedData[CURRENT_SESSION_KEY] : [];

  return cachedItems;
}

/**
 * @param itemId String - created like `wikiId_articleId`
 */
function update(itemId) {
  cacheItems(get().concat(itemId));
}

function remove(itemCount) {
  cacheItems(get().slice(itemCount));
}

function clear() {
  const items = get();

  if (!items) {
    localStorageConnector.removeItem(CACHE_KEY);
  }
}

export default {
  get,
  update,
  remove,
  clear,
};
