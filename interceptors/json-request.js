import isJson from './isJson';

const jsonRequest = {
  request(url, config = {}) {
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (typeof config.headers === 'object') Object.assign(config.headers, headers);
    else Object.assign(config, { headers });
    if (config.body && !isJson(config.body)) config.body = JSON.stringify(config.body);

    return [url, config];
  },
  id: 'KESTREL_JSON_REQUEST'
};


export default jsonRequest;
