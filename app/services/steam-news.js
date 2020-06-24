import Service from '@ember/service';

export default Service.extend({
  fetchNews(ids) {
    return Object.values(ids).map(id => fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${id}&count=5&maxlength=300&format=json`,
      {
        headers: {
          'accept': 'application/json'
        },
      }
    ).then(res => res.text()));

    const res = Promise.allSettled(promises);
    console.log(res);

    return res.map(response => {
      console.log(response.value);
      return response.value.json()
    })
        .reduce((all, items) => {
          all.push(...items)
        });
  },
});
