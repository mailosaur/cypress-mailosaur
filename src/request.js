const pkg = require('../package.json');

/* eslint-disable max-classes-per-file */
class Request {
  constructor(options) {
    this.baseUrl = options.baseUrl || 'https://mailosaur.com/';
    this.apiKey = options.apiKey;
    const b64 = btoa || ((str) => Buffer.from(str).toString('base64'));
    const encodedKey = b64(`${this.apiKey}:`);
    this.headers = {
      Accept: 'application/json',
      Authorization: `Basic ${encodedKey}`,
      'User-Agent': `cypress-mailosaur/${pkg.version}`,
    };
  }

  buildOptions(method, path, opts = {}) {
    if (!this.apiKey) {
      // CYPRESS_ prefix necessary per https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS
      throw new Error('You must set the CYPRESS_MAILOSAUR_API_KEY environment variable to use the Mailosaur plugin.');
    }

    return {
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Accept: this.headers.Accept,
        Authorization: this.headers.Authorization,
        'User-Agent': this.headers['User-Agent'],
      },
      ...opts
    };
  }

  getResponseHandler(includeResponseMetadata = false) {
    return (response) => {
      if (response.isOkStatusCode) {
        return includeResponseMetadata ? response : response.body;
      }

      let message = '';
      switch (response.status) {
        case 400:
          try {
            const json = response.body;
            json.errors.forEach(err => {
              message += `(${err.field}) ${err.detail[0].description}\r\n`;
            });
          } catch (e) {
            message = 'Request had one or more invalid parameters.';
          }
          throw new Error(message);
        case 401:
          throw new Error('Authentication failed, check your API key.');
        case 403:
          throw new Error('Insufficient permission to perform that task.');
        case 404:
          throw new Error('Not found, check input parameters.');
        default:
          throw new Error('An API error occurred, see httpResponse for further information.');
      }
    };
  }

  request(method, path, body, opts = {}) {
    const options = this.buildOptions(method, path, opts);
    options.body = body || undefined;
    options.failOnStatusCode = false;
    return cy.request(options).then(this.getResponseHandler());
  }

  get(path, opts) {
    return this.request('GET', path, undefined, opts);
  }

  post(path, body, opts) {
    return this.request('POST', path, body, opts);
  }

  put(path, body, opts) {
    return this.request('PUT', path, body, opts);
  }

  del(path, opts) {
    return this.request('DELETE', path, undefined, opts);
  }
}

module.exports = Request;
