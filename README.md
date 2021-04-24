# kestrel

kestrel is an isomorphic class-based means of extending fetch, either window.fetch or global.fetch in NodeJS.

kestrel enhances fetch with interceptors without polluting fetch itself. It does so by embracing a class-based approach. Interceptors consist of objects that include one or more functions which are processed in order. Functions that can be included in interceptor objects include request, requestError, response and/or responseError. Interceptors are simple to write and share. This repo includes standard interceptors for making JSON requests, handling response errors and receiving JSON responses. 

## Benefits of Approach

kestrel has the following benefits over plain fetch and other approaches to wrap fetch:
- tiny - it is 2.2KB unminified.
- it has method shortcuts, such as fc.get(), fc.post(), etc.
- it automatically dedupes requests and caches responses
- global fetch, whether window.fetch or node-fetch remains untouched. It is not monkey patched. 
- class based - You can create more than one instance if necessary to accommodate different APIs. Naturally, instances are isolated. 
- interceptors can be swapped on the fly.
- interceptors can be overloaded.
- interceptors can be shared.
- you can build complex solutions.

## Dependencies

Global fetch is required. kestrel has been tested against window.fetch, node-fetch and isomorphic-fetch. NodeJS 6x or greater is required.

kestrel has been developed with modern Javascript. Your project must be able to consume EcmaScript modules or CommonJS in node. 


## Installation

kestrel can be installed with either npm or yarn. 
```shell
yarn add @savvagent-os/kestrel
```
or
```shell
npm i @savvagent-os/kestrel -S
```

## Use

Here are some ways of using kestrel.

You can use some interceptors included with kestrel. 

```Javascript
import { Kestrel, jsonRequest, jsonResponse } from '@savvagent-os/kestrel';
const interceptors = [jsonRequest, jsonResponse];
const client = new Kestrel(interceptors);

const resp = await client.request('http://some.url/', fetchOptions = {});
```

You can create your own interceptors and add and remove them dynamically.

```Javascript
import { Kestrel } from '@savvagent-os/kestrel';
import { interceptor, interceptor1, interceptor2 } from '../interceptors';

const client = new Kestrel();

client register(interceptor);

//register interceptor1 ahead of interceptor
client.register(interceptor1, 0);

// register interceptor2 at the end of the interceptor chain
client.register(interceptor2)

// get the current interceptors
const interceptors = client.getInterceptors();

// remove an interceptor
client.unregister(interceptorId)

// remove all the interceptors - useful for testing
client.clear();

// make requests
const url = 'https://gitlab.com/projects';

client.get(url)
  .then(response => console.log('response', response))
  .catch(error => console.log('error', error))

```

## API

Kestrel

fc.clear()
fc.delete(url, options)
fc.get(url, options)
fc.head(url, options)
fc.patch(url, options)
fc.post(url, options)
fc.put(url, options)
fc.register(interceptor or array of interceptors)
fc.request(url, options)
fc.unregister(interceptorId)

# Interceptors

Interceptors are objects that must have at least one of the following functions: request, requestError, response, responseError. Hopefully, the purpose of the functions is clear from the names. 

Interceptors run in order. So if I had an interceptor designed to catch network errors, I would want that interceptor to the first interceptor in the interceptor chain. 

### Interceptor Internals

An interceptor is an object that has a unique id and includes one or more permitted functions.

```Javascript
export default {
  request(url, config = {}) {
    Object.assign(config, {headers: {Accept: 'application/json'}});
    return [url, config];
  },
  requestError(error) {
    return Promise.reject(error);
  },
  response(response) {
    // modify the response
    return response;
  },
  responseError(error) {
    return Promise.reject(error);
  }
  id: 'JSON_REQUEST'
};
```

You can create interceptors for various needs. For example, here's an audio interceptor:

```JavaScript
export const audioInterceptor = {
  const source = audioCtx.createBufferSource();
  response(response) {
    return response.arrayBuffer()
      .then(buffer => audioCtx.decodeAudioData(buffer, decodedData => {
        source.buffer = decodedData;
        source.connect(audioCtx.destination);
      }))
      .then(() => source);
  }
  id: 'AUDIO_INTERCEPTOR'
}
```

