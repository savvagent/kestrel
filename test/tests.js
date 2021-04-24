import fetch from 'node-fetch';
import fetchMock from 'fetch-mock';
global.fetch = fetch;
global.fetchMock = fetchMock;

import './Kestrel.spec';
import './interceptors.spec';


