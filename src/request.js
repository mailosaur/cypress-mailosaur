const pkg = require('../package.json');

/* eslint-disable max-classes-per-file */
class Request {
  constructor(options) {
    this.baseUrl = options.baseUrl || 'https://mailosaur.com/';
    const encodedKey = Buffer.from(`${options.apiKey}:`).toString('base64');
    this.headers = {
      Accept: 'application/json',
      Authorization: `Basic ${encodedKey}`,
      'User-Agent': `cypress-mailosaur/${pkg.version}`
    };
  }

  buildOptions(method, path) {
    return {
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Accept: this.headers.Accept,
        Authorization: this.headers.Authorization,
        'User-Agent': this.headers['User-Agent']
      }
    };
  }

  request(method, path, body) {
    const options = this.buildOptions(method, path);
    options.body = body || undefined;
    return cy.request(options).its('body');
  }

  get(path) {
    return this.request('GET', path);
  }

  post(path, body) {
    return this.request('POST', path, body);
  }

  put(path, body) {
    return this.request('PUT', path, body);
  }

  del(path) {
    return this.request('DELETE', path);
  }
}

module.exports = Request;
