'use strict';

var fetch$1 = require('node-fetch');
var fetchMock$1 = require('fetch-mock');
var chai = require('chai');
var TinyUri = require('tiny-uri');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch$1);
var fetchMock__default = /*#__PURE__*/_interopDefaultLegacy(fetchMock$1);
var TinyUri__default = /*#__PURE__*/_interopDefaultLegacy(TinyUri);

class Kestrel {
  constructor(interceptors = [], _fetch) {
    const f = typeof fetch === 'function' && typeof window !== 'undefined' ? fetch.bind(window) : typeof global !== 'undefined' ? fetch.bind(global) : fetch;
    this.interceptors = [...interceptors];
    this.requestMap = new Map();
    this.requestCache = new Map();
    this.fetch = f;
  }

  clear() {
    this.interceptors = [];
  }

  interceptor(...args) {
    let promise = Promise.resolve(args);

    this.interceptors.forEach(({ request, requestError }) => {
      if (request || requestError) {
        promise = promise.then((_args) => request(..._args), requestError);
      }
    });

    // Register fetch call
    promise = promise.then((_args) => {
      const [url, config] = _args;
      return this.fetch(url, config);
    });

    // Register response interceptors
    this.interceptors.forEach(({ response, responseError }) => {
      if (response || responseError) {
        promise = promise.then(response, responseError);
      }
    });

    return promise;
}

  register(_interceptor, pos) {
    if (Array.isArray(_interceptor)) this.interceptors = [...this.interceptors, ..._interceptor];
    else {
      const existing = Boolean(this.interceptors.find((i) => i.id === _interceptor.id));
      if (pos !== 'undefined' && !existing) {
        this.interceptors.splice(pos, 0, _interceptor);
      } else if (!existing) this.interceptors = [...this.interceptors, _interceptor];
    }
  }

  request(...args) {
    const [url, config] = args;
    const conf = config || {};
    const s = JSON.stringify(...args);
    const loading = this.requestMap.get(s);
    const cached = this.requestCache.has(s);
    if (loading) return loading;
    if (cached) return this.requestCache.get(s).response;
    const response = this.interceptor(...args)
      .finally(() => {
        this.requestMap.delete(s);
        const cache = this.requestCache.get(s);
        const { ttl } = cache;
        setTimeout(() => this.requestCache.delete(s), ttl);
    });
    this.requestMap.set(s, response);
    this.requestCache.set(s, { ttl: conf.ttl || 0, response });
    return response;
  }

  delete(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'DELETE';
    return this.request(url, conf);
  }

  get(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'GET';
    return this.request(url, conf);
  }

  head(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'HEAD';
    return this.request(url, conf);
  }

  patch(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'PATCH';
    return this.request(url, conf);
  }

  post(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'POST';
    return this.request(url, conf);
  }

  put(...args) {
    const [url, config] = args;
    const conf = config || {};
    conf.method = 'PUT';
    return this.request(url, conf);
  }

  unregister(interceptorId) {
    this.interceptors = this.interceptors.filter((i) => i.id !== interceptorId);
  }

  get interceptors() {
    return this._interceptors;
  }

  set interceptors(val) {
    this._interceptors = val;
  }
}

function isJson(str) {
  try {
    if (JSON.parse(str)) return true;
  } catch(e) {
    return false;
  }
}

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

const jsonResponse = {
  response(response) {
    if (response.status === 204 || response.status === 201) return JSON.stringify({});
    return response.text()
      .then((text) => {
        try {
          return JSON.parse(text);
        } catch(err) {
          return text;
        }
      });
  },
  id: 'KESTREL_JSON_RESPONSE'
};

const rejectErrors = {
  response(response) {
    if (isJson(response)) return response;
    if (!response.ok) throw response;
    return response;
  },
  id: 'KESTREL_REJECT_ERRORS'
};

var mockEmployees = {
    "status": "success",
    "data": [
        {
            "id": 1,
            "employee_name": "Tiger Nixon",
            "employee_salary": 320800,
            "employee_age": 61,
            "profile_image": ""
        },
        {
            "id": 2,
            "employee_name": "Garrett Winters",
            "employee_salary": 170750,
            "employee_age": 63,
            "profile_image": ""
        },
        {
            "id": 3,
            "employee_name": "Ashton Cox",
            "employee_salary": 86000,
            "employee_age": 66,
            "profile_image": ""
        },
        {
            "id": 4,
            "employee_name": "Cedric Kelly",
            "employee_salary": 433060,
            "employee_age": 22,
            "profile_image": ""
        },
        {
            "id": 5,
            "employee_name": "Airi Satou",
            "employee_salary": 162700,
            "employee_age": 33,
            "profile_image": ""
        },
        {
            "id": 6,
            "employee_name": "Brielle Williamson",
            "employee_salary": 372000,
            "employee_age": 61,
            "profile_image": ""
        },
        {
            "id": 7,
            "employee_name": "Herrod Chandler",
            "employee_salary": 137500,
            "employee_age": 59,
            "profile_image": ""
        },
        {
            "id": 8,
            "employee_name": "Rhona Davidson",
            "employee_salary": 327900,
            "employee_age": 55,
            "profile_image": ""
        },
        {
            "id": 9,
            "employee_name": "Colleen Hurst",
            "employee_salary": 205500,
            "employee_age": 39,
            "profile_image": ""
        },
        {
            "id": 10,
            "employee_name": "Sonya Frost",
            "employee_salary": 103600,
            "employee_age": 23,
            "profile_image": ""
        },
        {
            "id": 11,
            "employee_name": "Jena Gaines",
            "employee_salary": 90560,
            "employee_age": 30,
            "profile_image": ""
        },
        {
            "id": 12,
            "employee_name": "Quinn Flynn",
            "employee_salary": 342000,
            "employee_age": 22,
            "profile_image": ""
        },
        {
            "id": 13,
            "employee_name": "Charde Marshall",
            "employee_salary": 470600,
            "employee_age": 36,
            "profile_image": ""
        },
        {
            "id": 14,
            "employee_name": "Haley Kennedy",
            "employee_salary": 313500,
            "employee_age": 43,
            "profile_image": ""
        },
        {
            "id": 15,
            "employee_name": "Tatyana Fitzpatrick",
            "employee_salary": 385750,
            "employee_age": 19,
            "profile_image": ""
        },
        {
            "id": 16,
            "employee_name": "Michael Silva",
            "employee_salary": 198500,
            "employee_age": 66,
            "profile_image": ""
        },
        {
            "id": 17,
            "employee_name": "Paul Byrd",
            "employee_salary": 725000,
            "employee_age": 64,
            "profile_image": ""
        },
        {
            "id": 18,
            "employee_name": "Gloria Little",
            "employee_salary": 237500,
            "employee_age": 59,
            "profile_image": ""
        },
        {
            "id": 19,
            "employee_name": "Bradley Greer",
            "employee_salary": 132000,
            "employee_age": 41,
            "profile_image": ""
        },
        {
            "id": 20,
            "employee_name": "Dai Rios",
            "employee_salary": 217500,
            "employee_age": 35,
            "profile_image": ""
        },
        {
            "id": 21,
            "employee_name": "Jenette Caldwell",
            "employee_salary": 345000,
            "employee_age": 30,
            "profile_image": ""
        },
        {
            "id": 22,
            "employee_name": "Yuri Berry",
            "employee_salary": 675000,
            "employee_age": 40,
            "profile_image": ""
        },
        {
            "id": 23,
            "employee_name": "Caesar Vance",
            "employee_salary": 106450,
            "employee_age": 21,
            "profile_image": ""
        },
        {
            "id": 24,
            "employee_name": "Doris Wilder",
            "employee_salary": 85600,
            "employee_age": 23,
            "profile_image": ""
        }
    ],
    "message": "Successfully! All records has been fetched."
};

function employees() {
  return mockEmployees;
}

describe.only('Kestrel class', () => {
  let client;
  const url = 'http://localhost:8080/employees';

  beforeEach(() => {
    fetchMock__default['default'].get(url, employees);
    fetchMock__default['default'].put(url, employees);
    fetchMock__default['default'].post(url, employees);
    fetchMock__default['default'].delete(url, employees);
    fetchMock__default['default'].patch(url, employees);
    client = new Kestrel();
  });

  afterEach(() => {
    fetchMock__default['default'].reset();
    fetchMock__default['default'].restore();
    client = null;
  });

  it('should have certain methods and properties when instantiated', () => {
    chai.expect(client).to.be.instanceof(Kestrel);
    chai.expect(client.clear).to.be.a('function');
    chai.expect(client.request).to.be.a('function');
    chai.expect(client.get).to.be.a('function');
    chai.expect(client.put).to.be.a('function');
    chai.expect(client.post).to.be.a('function');
    chai.expect(client.delete).to.be.a('function');
    chai.expect(client.patch).to.be.a('function');
    chai.expect(client.register).to.be.a('function');
    chai.expect(client.unregister).to.be.a('function');
    chai.expect(client.interceptors).to.be.an('array');
  });

  it('should support creating multiple instances', () => {
    const client1 = new Kestrel();
    chai.expect(client).to.not.be.equal(client1);
  });

  it('should support instantiation with an array of interceptors', () => {
    const arr = [jsonRequest, jsonResponse];
    client = new Kestrel(arr);
    const { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(2);
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_REQUEST');
    chai.expect(interceptors[1].id).to.be.equal('KESTREL_JSON_RESPONSE');
  });

  it('should register a response interceptor', () => {
    client.register(jsonResponse);
    const { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_RESPONSE');
  });

   it('should register an interceptor only once', () => {
    client.register(jsonResponse);
    client.register(jsonResponse);
    client.register(jsonResponse);
    const { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(1);
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_RESPONSE');
  });

  it('should register an array of interceptors', () => {
    const arr = [jsonRequest, jsonResponse];
    client.register(arr);
    const { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(2);
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_REQUEST');
    chai.expect(interceptors[1].id).to.be.equal('KESTREL_JSON_RESPONSE');
  });

  it('should register a response interceptor in a specific location', () => {
    client.register(jsonResponse);
    client.register(jsonRequest, 0);
    const { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(2);
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_REQUEST');
  });

  it(`should support clearing interceptors`, () => {
    client.register(jsonResponse);
    let { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_RESPONSE');
    client.clear();
    interceptors = client.interceptors;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(0);
  });

  it(`should support unregistering an interceptor`, () => {
    client.register(jsonResponse);
    let { interceptors } = client;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors[0].id).to.be.equal('KESTREL_JSON_RESPONSE');
    client.unregister('KESTREL_JSON_RESPONSE');
    interceptors = client.interceptors;
    chai.expect(interceptors).to.be.an('array');
    chai.expect(interceptors).to.have.length(0);
  });

  it(`should dedupe requests`, async () => {
    client = new Kestrel([jsonRequest, jsonResponse]);
    chai.expect(client.requestCache.size).to.equal(0);
    const resp1 = await client.request(url);
    chai.expect(client.requestCache.size).to.equal(1);
    const resp2 = await client.request(url);
    chai.expect(client.requestCache.size).to.equal(1);
    const resp3 = await client.request(url);
    chai.expect(client.requestCache.size).to.equal(1);
    const resp4 = await client.request(url);
    chai.expect(client.requestCache.size).to.equal(1);
    chai.expect(resp2).to.equal(resp1);
    chai.expect(resp3).to.equal(resp1);
    chai.expect(resp4).to.equal(resp1);
  });

  it(`should consolidate concurrent requests`, async () => {
    client = new Kestrel([jsonRequest, jsonResponse]);
    chai.expect(client.requestMap.size).to.equal(0);
    const req1 = client.request(url);
    chai.expect(client.requestMap.size).to.equal(1);
    const req2 = client.request(url);
    chai.expect(client.requestMap.size).to.equal(1);
    const req3 = client.request(url);
    chai.expect(client.requestMap.size).to.equal(1);
    const req4 = client.request(url);
    chai.expect(client.requestMap.size).to.equal(1);

    const [one, two, three, four] = await Promise.all([req1, req2, req3, req4]);
    chai.expect(two).to.equal(one);
    chai.expect(three).to.equal(one);
    chai.expect(four).to.equal(one);

    chai.expect(client.requestMap.size).to.equal(0);

  });

  describe('convenience methods', () => {
    it(`should support get`, async() => {
      const arr = [rejectErrors, jsonRequest, jsonResponse];
      client.register(arr);
      const resp = await client.get(url);
      chai.expect(resp.data).to.be.an('array');
      chai.expect(resp.data).to.have.length(24);
    });

    it(`should support post`, async() => {
      const arr = [rejectErrors, jsonRequest, jsonResponse];
      client.register(arr);
      try {
        const resp = await client.post(url, {
          body:
          {
          id: 25,
          employee_name: "Tom Bobby",
          employee_salary: 86000,
          employee_age: 305,
          profile_image: ""
        }
      });
        chai.expect(resp).to.be.ok;
      } catch (error) {
        chai.expect(error).to.not.exist;
      }
    });
    it(`should support put`, async() => {
      fetchMock__default['default'].put(`${url}/25`, employees);
      const arr = [jsonRequest, jsonResponse];
      client.register(arr);
      try {
        const resp = await client.put(`${url}/25`, {
        body: {
          id: 25,
          employee_name: "Tom Bobby",
          employee_salary: 86000,
          employee_age: 25,
          profile_image: ""
        }
      });
        chai.expect(resp).to.be.ok;
      } catch (error) {
        chai.expect(error).to.not.exist;
      }
    });
    it(`should support patch`, async() => {
      fetchMock__default['default'].patch(`${url}/25`, employees);
      const arr = [jsonRequest, jsonResponse];
      client.register(arr);
      try {
        const resp = await client.patch(`${url}/25`, {
        body: {
          id: 25,
          employee_name: "Tom Bobby",
          employee_salary: 86000,
          employee_age: 2500,
          profile_image: ""
        }
      });
        chai.expect(resp).to.be.ok;
      } catch (error) {
        chai.expect(error).to.not.exist;
      }
    });
  });
});

const bustCache = {
  request(url, config = {}) {
    if (config && config.bustCache) {
      const u = new TinyUri__default['default'](url);
      u.query.add({ rn: new Date().getTime().toString() });
      url = u.toString();
    }

    return [url, config];
  },
  id: 'KESTREL_BUST_CACHE'
};

describe.only('standard interceptors', () => {
  let client;
  const url = 'http://dummy.restapiexample.com/api/v1/employees';

  beforeEach(() => {
    client = new Kestrel();
    fetchMock.get(`begin:${url}`, mockEmployees);
    fetchMock.post(`begin:${url}`, mockEmployees);
  });

  afterEach(() => {
    fetchMock.resetHistory();
    fetchMock.restore();
    client = null;
  });

  it(`should register some interceptors upon invocation`, () => {
    client = new Kestrel([jsonRequest]);
    chai.expect(client.interceptors).to.be.an('array');
    chai.expect(client.interceptors).to.have.length(1);
  });

  it('should make a json request', () => {
    client = new Kestrel([jsonRequest]);

    return client.request(url)
      .then((response) => {
        chai.expect(response.status).to.equal(200);
      })
      .catch((err) => chai.expect(err).to.not.exist);
  });

  it('should stringify the body of json request', () => {
    client = new Kestrel([jsonRequest]);

    return client.request(url, { method: 'POST', data: { name: 'foo' } })
      .then((response) => {
        chai.expect(response.status).to.equal(200);
      })
      .catch((err) => chai.expect(err).to.not.exist);
  });

  it('should make a json request and get a json response', () => {
    client = new Kestrel([jsonRequest, jsonResponse]);

    return client.request(url)
      .then((response) => {
        chai.expect(response.status).to.equal('success');
      })
      .catch((err) => chai.expect(err).to.not.exist);
  });

  describe(`bustCache interceptor`, () => {
    it(`should add a random number string to the request url`, async () => {
      client = new Kestrel([bustCache]);
      const response = await client.request(url, { bustCache: true });
      chai.expect(response.url).to.contain('?rn=');
    });
  });

});

global.fetch = fetch__default['default'];
global.fetchMock = fetchMock__default['default'];
