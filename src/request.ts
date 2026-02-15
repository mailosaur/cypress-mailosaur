const pkg = require('../package.json');

/* eslint-disable max-classes-per-file */

type RequestHeaders = {
  Accept: string;
  Authorization: string;
  'User-Agent': string;
};

interface RequestInitOptions {
  baseUrl?: string;
  apiKey?: string;
}

interface RequestOptions extends Record<string, unknown> {
  method: string;
  url: string;
  headers: RequestHeaders;
  encoding?: string;
  qs?: Record<string, string | number | Date | undefined>;
  json?: unknown;
  body?: unknown;
  failOnStatusCode?: boolean;
}

interface CypressResponse {
  isOkStatusCode: boolean;
  status: number;
  body?: any;
  headers?: Record<string, unknown>;
}

declare const btoa: ((data: string) => string) | undefined;
declare const cy: any;

class Request {
  baseUrl: string;
  apiKey?: string;
  headers: RequestHeaders;

  constructor(options: RequestInitOptions) {
    this.baseUrl = options.baseUrl || 'https://mailosaur.com/';
    this.apiKey = options.apiKey;
    const base64Encode = typeof btoa === 'function'
      ? btoa
      : (str: string) => Buffer.from(str).toString('base64');
    const encodedKey = base64Encode(`${this.apiKey || ''}:`);
    this.headers = {
      Accept: 'application/json',
      Authorization: `Basic ${encodedKey}`,
      'User-Agent': `cypress-mailosaur/${pkg.version}`,
    };
  }

  buildOptions(
    method: string,
    path: string,
    opts: Record<string, unknown> = {}
  ): RequestOptions {
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
      ...opts,
    } as RequestOptions;
  }

  getResponseHandler(includeResponseMetadata = false) {
    return (response: CypressResponse) => {
      if (response.isOkStatusCode) {
        return includeResponseMetadata ? response : response.body;
      }

      let message = '';
      switch (response.status) {
        case 400:
          try {
            const json = response.body as { errors?: Array<{ field: string; detail: Array<{ description: string }> }> };
            json.errors?.forEach((err) => {
              message += `(${err.field}) ${err.detail[0].description}\r\n`;
            });
          } catch (_e) {
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

  request(
    method: string,
    path: string,
    body?: unknown,
    opts: Record<string, unknown> = {}
  ) {
    const options = this.buildOptions(method, path, opts);
    options.body = body || undefined;
    options.failOnStatusCode = false;
    return cy.request(options).then(this.getResponseHandler());
  }

  get(path: string, opts?: Record<string, unknown>) {
    return this.request('GET', path, undefined, opts);
  }

  post(path: string, body?: unknown, opts?: Record<string, unknown>) {
    return this.request('POST', path, body, opts);
  }

  put(path: string, body?: unknown, opts?: Record<string, unknown>) {
    return this.request('PUT', path, body, opts);
  }

  del(path: string, opts?: Record<string, unknown>) {
    return this.request('DELETE', path, undefined, opts);
  }
}

export default Request;
