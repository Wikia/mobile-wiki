import Service, { inject as service } from '@ember/service';
import { ArticleCommentsFetchError } from '../utils/errors';
import { track, trackActions } from '../utils/track';


export default Service.extend({
  fetchNews(ids) {
    const promises = ids.map((id) => {
      return fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${id}&count=5&maxlength=300&format=json`);
    });
    return Promise.allSettled(...promises).then((payload) => {
      return payload;
    });
  },
});
