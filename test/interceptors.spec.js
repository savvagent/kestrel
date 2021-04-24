import { expect } from 'chai';
import bustCache from '../interceptors/bust-cache';
import Kestrel from '../src/Kestrel';
import jsonRequest from '../interceptors/json-request';
import jsonResponse from '../interceptors/json-response';
import rejectErrors from '../interceptors/reject-errors';
import mockEmployees from './mockEmployees';

describe.only('standard interceptors', () => {
  let client,
sandbox;
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
    expect(client.interceptors).to.be.an('array');
    expect(client.interceptors).to.have.length(1);
  });

  it('should make a json request', () => {
    client = new Kestrel([jsonRequest]);

    return client.request(url)
      .then((response) => {
        expect(response.status).to.equal(200);
      })
      .catch((err) => expect(err).to.not.exist);
  });

  it('should stringify the body of json request', () => {
    client = new Kestrel([jsonRequest]);

    return client.request(url, { method: 'POST', data: { name: 'foo' } })
      .then((response) => {
        expect(response.status).to.equal(200);
      })
      .catch((err) => expect(err).to.not.exist);
  });

  it('should make a json request and get a json response', () => {
    client = new Kestrel([jsonRequest, jsonResponse]);

    return client.request(url)
      .then((response) => {
        expect(response.status).to.equal('success');
      })
      .catch((err) => expect(err).to.not.exist);
  });

  describe(`bustCache interceptor`, () => {
    it(`should add a random number string to the request url`, async () => {
      client = new Kestrel([bustCache]);
      const response = await client.request(url, { bustCache: true });
      expect(response.url).to.contain('?rn=');
    });
  });

});
