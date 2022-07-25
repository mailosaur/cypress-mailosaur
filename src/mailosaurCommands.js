/* eslint-disable class-methods-use-this */

const Request = require('./request');

class MailosaurCommands {
  static get cypressCommands() {
    return [
      'mailosaurSetApiKey',
      'mailosaurListServers',
      'mailosaurCreateServer',
      'mailosaurGetServer',
      'mailosaurGetServerPassword',
      'mailosaurUpdateServer',
      'mailosaurDeleteServer',
      'mailosaurListMessages',
      'mailosaurCreateMessage',
      'mailosaurForwardMessage',
      'mailosaurReplyToMessage',
      'mailosaurGetMessage',
      'mailosaurGetMessageById',
      'mailosaurSearchMessages',
      'mailosaurGetMessagesBySubject',
      'mailosaurGetMessagesByBody',
      'mailosaurGetMessagesBySentFrom',
      'mailosaurGetMessagesBySentTo',
      'mailosaurDeleteMessage',
      'mailosaurDeleteAllMessages',
      'mailosaurDownloadAttachment',
      'mailosaurDownloadMessage',
      'mailosaurGetSpamAnalysis',
      'mailosaurGenerateEmailAddress',
      'mailosaurGetUsageLimits',
      'mailosaurGetUsageTransactions',
      'mailosaurListDevices',
      'mailosaurCreateDevice',
      'mailosaurGetDeviceOtp',
      'mailosaurDeleteDevice',
    ];
  }

  constructor() {
    const defaultApiKey = Cypress.env('MAILOSAUR_API_KEY');
    this.mailosaurSetApiKey(defaultApiKey);
  }

  mailosaurSetApiKey(apiKey) {
    this.request = new Request({ apiKey, baseUrl: Cypress.env('MAILOSAUR_BASE_URL') });
  }

  mailosaurListServers() {
    return this.request.get('api/servers');
  }

  mailosaurCreateServer(options = {}) {
    return this.request.post('api/servers', options);
  }

  mailosaurGetServer(serverId) {
    return this.request.get(`api/servers/${serverId}`);
  }

  mailosaurGetServerPassword(serverId) {
    return this.request.get(`api/servers/${serverId}/password`)
      .then((result) => (result.value));
  }

  mailosaurUpdateServer(server = {}) {
    return this.request.put(`api/servers/${server.id}`, server);
  }

  mailosaurDeleteServer(serverId) {
    return this.request.del(`api/servers/${serverId}`);
  }

  mailosaurDeleteAllMessages(serverId) {
    return this.request.del(`api/messages?server=${serverId}`);
  }

  mailosaurListMessages(serverId, options = {}) {
    const qs = {
      server: serverId,
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      receivedAfter: options.receivedAfter,
    };

    return this.request.get('api/messages', { qs });
  }

  mailosaurCreateMessage(serverId, options = {}) {
    return this.request.post(`api/messages?server=${serverId}`, options);
  }

  mailosaurForwardMessage(messageId, options = {}) {
    return this.request.post(`api/messages/${messageId}/forward`, options);
  }

  mailosaurReplyToMessage(messageId, options = {}) {
    return this.request.post(`api/messages/${messageId}/reply`, options);
  }

  mailosaurGetMessage(server, criteria = {}, options = {}) {
    // Only return 1 result
    options.page = 0; // eslint-disable-line no-param-reassign
    options.itemsPerPage = 1; // eslint-disable-line no-param-reassign

    // Default timeout to 10s
    options.timeout = options.timeout || 10000; // eslint-disable-line no-param-reassign

    // Default receivedAfter to 1h
    options.receivedAfter = options.receivedAfter || new Date(Date.now() - 3600000); // eslint-disable-line no-param-reassign

    return cy.mailosaurSearchMessages(server, criteria, options)
      .then((result) => (
        cy.mailosaurGetMessageById(result.items[0].id)
      ));
  }

  mailosaurGetMessageById(messageId) {
    return this.request.get(`api/messages/${messageId}`);
  }

  mailosaurSearchMessages(serverId, searchCriteria = {}, options = {}) {
    let pollCount = 0;
    const startTime = Date.now();

    const qs = {
      server: serverId,
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      receivedAfter: options.receivedAfter,
    };

    if (!Number.isInteger(options.timeout)) {
      options.timeout = 0; // eslint-disable-line no-param-reassign
    }

    if (typeof options.errorOnTimeout !== 'boolean') {
      options.errorOnTimeout = true; // eslint-disable-line no-param-reassign
    }

    const fn = (resolve, reject) => () => {
      const reqOptions = this.request.buildOptions('POST', 'api/messages/search');
      reqOptions.qs = qs;
      reqOptions.json = searchCriteria;

      return Cypress.backend('http:request', reqOptions)
        .timeout(10000)
        .then(this.request.getResponseHandler(true))
        .then((result) => {
          const { body, headers } = result;

          if (options.timeout && !body.items.length) {
            const delayPattern = (headers['x-ms-delay'] || '1000')
              .split(',')
              .map((x) => parseInt(x, 10));

            const delay = (pollCount >= delayPattern.length)
              ? delayPattern[delayPattern.length - 1]
              : delayPattern[pollCount];

            pollCount += 1;

            // Stop if timeout will be exceeded
            if (((Date.now() - startTime) + delay) > options.timeout) {
              return (options.errorOnTimeout === false)
                ? resolve(body)
                : reject(new Error('No matching messages found in time. By default, only messages received in the last hour are checked (use receivedAfter to override this).'));
            }

            return setTimeout(fn(resolve, reject), delay);
          }

          return resolve(body);
        });
    };

    cy.wrap(new Cypress.Promise((resolve, reject) => {
      fn(resolve, reject)();
    }), {
      log: false,
      timeout: options.timeout + 10000,
    });
  }

  mailosaurGetMessagesBySubject(serverId, subject) {
    return cy.mailosaurSearchMessages(serverId, { subject });
  }

  mailosaurGetMessagesByBody(serverId, body) {
    return cy.mailosaurSearchMessages(serverId, { body });
  }

  mailosaurGetMessagesBySentFrom(serverId, sentFrom) {
    return cy.mailosaurSearchMessages(serverId, { sentFrom });
  }

  mailosaurGetMessagesBySentTo(serverId, sentTo) {
    return cy.mailosaurSearchMessages(serverId, { sentTo });
  }

  mailosaurDownloadAttachment(attachmentId) {
    return this.request.get(`api/files/attachments/${attachmentId}`, { encoding: 'binary' });
  }

  mailosaurDownloadMessage(messageId) {
    return this.request.get(`api/files/email/${messageId}`);
  }

  mailosaurDeleteMessage(messageId) {
    return this.request.del(`api/messages/${messageId}`);
  }

  mailosaurGetSpamAnalysis(messageId) {
    return this.request.get(`api/analysis/spam/${messageId}`);
  }

  mailosaurGenerateEmailAddress(serverId) {
    const host = Cypress.env('MAILOSAUR_SMTP_HOST') || 'mailosaur.net';
    const random = (Math.random() + 1).toString(36).substring(7);
    return cy.wrap(`${random}@${serverId}.${host}`);
  }

  mailosaurGetUsageLimits() {
    return this.request.get('api/usage/limits');
  }

  mailosaurGetUsageTransactions() {
    return this.request.get('api/usage/transactions');
  }

  mailosaurListDevices() {
    return this.request.get('api/devices');
  }

  mailosaurCreateDevice(options) {
    return this.request.post('api/devices', options);
  }

  mailosaurGetDeviceOtp(query) {
    if (!query || query.indexOf('-') > -1) {
      return this.request.get(`api/devices/${query}/otp`);
    }

    return this.request.post('api/devices/otp', {
      sharedSecret: query,
    });
  }

  mailosaurDeleteDevice(deviceId) {
    return this.request.del(`api/devices/${deviceId}`);
  }
}

module.exports = MailosaurCommands;
