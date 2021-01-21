// here are stored helper functions, which are used multiple times

import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          // creates POST request, need to pass in url and object of settings
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // when sending json
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url); // creates GET request

    // race between fetch and timeout :
    const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    // this API, where we're sending data (if POST), returns this data back, so we await for it and save it to const
    // fetch() returns response promise, on which we call .json(), which returns data promise
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (status: ${resp.status})`);

    return data;
  } catch (err) {
    // rethrowing error in order to catch it in model etc. Now promise returned by getJSON() will be rejected, because throw is like return - imediately rejects promise
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // fetch(url) creates GET request
    const fetchPromise = fetch(url);
    // race between fetch and timeout :
    const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    // fetch() returns response promise, on which we call .json(), which returns data promise
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (status: ${resp.status})`);

    return data;
  } catch (err) {
    // rethrowing error in order to catch it in model etc. Now promise returned by getJSON() will be rejected, because throw is like return - imediately rejects promise
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // POST request using fetch, need to pass in url and object of settings
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // when sending json
      },
      body: JSON.stringify(uploadData),
    });

    // race between fetch and timeout :
    const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    // this API, where we're sending data, returns this data back, so we await for it and save it to const
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (status: ${resp.status})`);

    return data;
  } catch (err) {
    // rethrowing error in order to catch it in model etc. Now promise returned by getJSON() will be rejected, because throw is like return - imediately rejects promise
    throw err;
  }
};
*/
