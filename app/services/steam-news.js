import Service, {inject as service} from '@ember/service';

export default Service.extend({
  wikiUrls: service(),
  wikiVariables: service(),
  fetchService: service('fetch'),
  async fetchNews(ids) {

    const promises = Object.values(ids)
      .map(id => this.get(id));

    const results = await Promise.allSettled(promises)

    return results
      .map(res => res.value)
      .reduce((acc, item) => {
        acc.push(...item)
        console.log(acc);
        return acc;
      })
      .sort((a, b) => b.date - a.date)
      .map(item => Object.assign(item, {date: new Date(item.date * 1000).toDateString()}));
  },

  get(id) {
    const url = this.wikiUrls.build({
      host: this.wikiVariables.host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getSteamNews',
        format: 'json',
        appid: id
      },
    });

    const options = this.fetchService.getOptionsForInternalCache(url);

    return fetch(url, options)
      .then(res => res.json())
      .then(data => data.steamNews.appnews.newsitems);
  }
});
