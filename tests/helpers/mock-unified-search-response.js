import Service from '@ember/service';

export default function mockUnifiedSearchResponse(owner) {
  owner.register('service:fetch', Service.extend({
    fetchFromUnifiedSearch(path) {
      if (path.startsWith('/page-search')) {
        return new Promise((resolve) => {
          resolve({
            paging: {
              current: 0,
              total: 1,
            },
            totalResultsFound: 8,
            results: [
              {
                id: '2237_47401',
                title: 'Destiny',
                content: 'This is the <span class="searchmatch">Destiny</span> disambiguation page. <span class="searchmatch">Destiny</span> is the cosmic avatar of <span class="searchmatch">destiny</span> as a member of the Endless. Their eldest brother, he presides over the Garden of Forking Ways and wields the Book of',
                pageId: 47401,
                wikiId: 2237,
                url: 'http://dc.servicesmw-s1.wikia-dev.us/wiki/Destiny',
                namespace: 0,
                hub: '',
              },
              {
                id: '4541_4246',
                title: 'Destiny',
                content: '<span class="searchmatch">Destiny</span> is a character in the Grand Theft Auto series who is mentioned in the Vice City Inquirer, the manual for Grand Theft Auto: Vice City Stories. <span class="searchmatch">Destiny</span>, a prostitute, won the Vice City Scratch',
                pageId: 4246,
                wikiId: 4541,
                url: 'http://gta.servicesmw-p1.fandom-dev.pl/wiki/Destiny',
                namespace: 0,
                hub: '',
              },
              {
                id: '998092_303',
                title: 'Destiny',
                content: '<span class="searchmatch">Destiny</span> (デスティニー) とは、海外では Bungie (バンジー) が開発し、海外では Activision (アクティビジョン',
                pageId: 303,
                wikiId: 998092,
                url: 'http://destiny.servicesmw-s1.wikia-dev.us/ja/wiki/Destiny',
                namespace: 0,
                hub: 'Gaming',
              },
              {
                id: '147_469834',
                title: 'Destiny',
                content: "an article link referred you here, you might want to go back and fix it to point directly to the intended page. <span class=\"searchmatch\">Destiny</span> can refer to: <span class=\"searchmatch\">Destiny</span> (episode), <span class=\"searchmatch\">Destiny</span> (Imperial starship), <span class=\"searchmatch\">Destiny</span> (Zirtran's Anchor)",
                pageId: 469834,
                wikiId: 147,
                url: 'http://starwars.servicesmw-s1.fandom-dev.us/wiki/Destiny',
                namespace: 0,
                hub: '',
              },
            ],
          });
        });
      }

      return new Promise((resolve, reject) => reject(new Error('Unknown url')));
    },
  }));
}
