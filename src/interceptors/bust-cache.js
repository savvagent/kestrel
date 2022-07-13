import TinyUri from 'tiny-uri';

const bustCache = {
  request(url, config = {}) {
    url = new TinyUri(url).query.add({ rn: new Date().getTime().toString() });

    return [url, config];
  },
  id: 'KESTREL_BUST_CACHE'
};

export default bustCache;
