import { isJson } from '../utils'

const jsonRequest = {
  request(url, config = {}) {
    config.headers = { ...config.headers || {}, Accept: 'application/json', 'Content-Type': 'application/json' }
    
    if (config.body && !isJson(config.body)) config.body = JSON.stringify(config.body);

    return [url, config];
  },
  id: 'KESTREL_JSON_REQUEST'
};


export default jsonRequest;
