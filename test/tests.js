import fetch from 'node-fetch';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';

global.fetch = fetch;
global.fetchMock = fetchMock;
global.expect = expect;

import './Kestrel.spec';
import './interceptors.spec';


