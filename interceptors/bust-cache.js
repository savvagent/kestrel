import TinyUri from 'tiny-uri';

const bustCache = {
  request(url, config = {}) {
    if (config && config.bustCache) {
      const u = new TinyUri(url);
      u.query.add({ rn: new Date().getTime().toString() });
      url = u.toString();
    }

    return [url, config];
  },
  id: 'KESTREL_BUST_CACHE'
};

export default bustCache;
