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
      'mailosaurGetDeliverabilityReport',
      'mailosaurGenerateEmailAddress',
      'mailosaurGetUsageLimits',
      'mailosaurGetUsageTransactions',
      'mailosaurListDevices',
      'mailosaurCreateDevice',
      'mailosaurGetDeviceOtp',
      'mailosaurDeleteDevice',
      'mailosaurListPreviewEmailClients',
      'mailosaurGenerateEmailPreviews',
      'mailosaurDownloadPreview',
    ];
  }

  constructor() {
    this.request = null;
  }

  ensureInitialized() {
    if (!this.request) {
      return cy.env(['MAILOSAUR_API_KEY', 'MAILOSAUR_BASE_URL']).then(({ MAILOSAUR_API_KEY, MAILOSAUR_BASE_URL }) => {
        this.request = new Request({ apiKey: MAILOSAUR_API_KEY, baseUrl: MAILOSAUR_BASE_URL });
      });
    }
    return cy.wrap(null);
  }

  mailosaurSetApiKey(apiKey) {
    return cy.env(['MAILOSAUR_BASE_URL']).then(({ MAILOSAUR_BASE_URL }) => {
      this.request = new Request({ apiKey, baseUrl: MAILOSAUR_BASE_URL });
    });
  }

  mailosaurListServers() {
    return this.ensureInitialized().then(() => this.request.get('api/servers'));
  }

  mailosaurCreateServer(options = {}) {
    return this.ensureInitialized().then(() => this.request.post('api/servers', options));
  }

  mailosaurGetServer(serverId) {
    return this.ensureInitialized().then(() => this.request.get(`api/servers/${serverId}`));
  }

  mailosaurGetServerPassword(serverId) {
    return this.ensureInitialized().then(() => this.request.get(`api/servers/${serverId}/password`)
      .then((result) => (result.value)));
  }

  mailosaurUpdateServer(server = {}) {
    return this.ensureInitialized().then(() => this.request.put(`api/servers/${server.id}`, server));
  }

  mailosaurDeleteServer(serverId) {
    return this.ensureInitialized().then(() => this.request.del(`api/servers/${serverId}`));
  }

  mailosaurDeleteAllMessages(serverId) {
    return this.ensureInitialized().then(() => this.request.del(`api/messages?server=${serverId}`));
  }

  mailosaurListMessages(serverId, options = {}) {
    const qs = {
      server: serverId,
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      receivedAfter: options.receivedAfter,
      dir: options.dir,
    };

    return this.ensureInitialized().then(() => this.request.get('api/messages', { qs }));
  }

  mailosaurCreateMessage(serverId, options = {}) {
    return this.ensureInitialized().then(() => this.request.post(`api/messages?server=${serverId}`, options));
  }

  mailosaurForwardMessage(messageId, options = {}) {
    return this.ensureInitialized().then(() => this.request.post(`api/messages/${messageId}/forward`, options));
  }

  mailosaurReplyToMessage(messageId, options = {}) {
    return this.ensureInitialized().then(() => this.request.post(`api/messages/${messageId}/reply`, options));
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
    return this.ensureInitialized().then(() => this.request.get(`api/messages/${messageId}`));
  }

  mailosaurSearchMessages(serverId, searchCriteria = {}, options = {}) {
    return this.ensureInitialized().then(() => {
      let pollCount = 0;
      const startTime = Date.now();

      const qs = {
        server: serverId,
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        receivedAfter: options.receivedAfter,
        dir: options.dir,
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
                  : reject(new Error(`No matching messages found in time. By default, only messages received in the last hour are checked (use receivedAfter to override this). The search criteria used for this query was [${JSON.stringify(searchCriteria)}] which timed out after ${options.timeout}ms`));
              }

              return setTimeout(fn(resolve, reject), delay);
            }

            return resolve(body);
          });
      };

      return cy.wrap(new Cypress.Promise((resolve, reject) => {
        fn(resolve, reject)();
      }), {
        log: false,
        timeout: options.timeout + 10000,
      });
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
    return this.ensureInitialized().then(() => this.request.get(`api/files/attachments/${attachmentId}`, { encoding: 'binary' }));
  }

  mailosaurDownloadMessage(messageId) {
    return this.ensureInitialized().then(() => this.request.get(`api/files/email/${messageId}`));
  }

  mailosaurDeleteMessage(messageId) {
    return this.ensureInitialized().then(() => this.request.del(`api/messages/${messageId}`));
  }

  mailosaurGetSpamAnalysis(messageId) {
    return this.ensureInitialized().then(() => this.request.get(`api/analysis/spam/${messageId}`));
  }

  mailosaurGetDeliverabilityReport(messageId) {
    return this.ensureInitialized().then(() => this.request.get(`api/analysis/deliverability/${messageId}`));
  }

  mailosaurGenerateEmailAddress(serverId) {
    return cy.env(['MAILOSAUR_SMTP_HOST']).then(({ MAILOSAUR_SMTP_HOST }) => {
      const host = MAILOSAUR_SMTP_HOST || 'mailosaur.net';
      const random = (Math.random() + 1).toString(36).substring(7);
      return `${random}@${serverId}.${host}`;
    });
  }

  mailosaurGetUsageLimits() {
    return this.ensureInitialized().then(() => this.request.get('api/usage/limits'));
  }

  mailosaurGetUsageTransactions() {
    return this.ensureInitialized().then(() => this.request.get('api/usage/transactions'));
  }

  mailosaurListDevices() {
    return this.ensureInitialized().then(() => this.request.get('api/devices'));
  }

  mailosaurCreateDevice(options) {
    return this.ensureInitialized().then(() => this.request.post('api/devices', options));
  }

  mailosaurGetDeviceOtp(query) {
    return this.ensureInitialized().then(() => {
      if (!query || query.indexOf('-') > -1) {
        return this.request.get(`api/devices/${query}/otp`);
      }

      return this.request.post('api/devices/otp', {
        sharedSecret: query,
      });
    });
  }

  mailosaurDeleteDevice(deviceId) {
    return this.ensureInitialized().then(() => this.request.del(`api/devices/${deviceId}`));
  }

  mailosaurListPreviewEmailClients() {
    return this.ensureInitialized().then(() => this.request.get('api/screenshots/clients'));
  }

  mailosaurGenerateEmailPreviews(messageId, options = {}) {
    return this.ensureInitialized().then(() => this.request.post(`api/messages/${messageId}/screenshots`, options));
  }

  mailosaurDownloadPreview(previewId) {
    return this.ensureInitialized().then(() => {
      const timeout = 120000;
      let pollCount = 0;
      const startTime = Date.now();

      const fn = (resolve, reject) => () => {
        const reqOptions = this.request.buildOptions('GET', `api/files/screenshots/${previewId}`);
        reqOptions.encoding = 'binary';

        return Cypress.backend('http:request', reqOptions)
          .timeout(timeout)
          .then(this.request.getResponseHandler(true))
          .then((result) => {
            const { body, headers, status } = result;

            if (status === 200) {
              return resolve(body);
            }

            if (status !== 202) {
              return reject(new Error(`Failed to download preview. Status code: ${status}`));
            }

            const delayPattern = (headers['x-ms-delay'] || '1000')
              .split(',')
              .map((x) => parseInt(x, 10));

            const delay = (pollCount >= delayPattern.length)
              ? delayPattern[delayPattern.length - 1]
              : delayPattern[pollCount];

            pollCount += 1;

            // Stop if timeout will be exceeded
            if (((Date.now() - startTime) + delay) > timeout) {
              return reject(new Error(`An email preview was not generated in time. The email client may not be available, or the preview ID [${previewId}] may be incorrect.`));
            }

            return setTimeout(fn(resolve, reject), delay);
          });
      };

      return cy.wrap(new Cypress.Promise((resolve, reject) => {
        fn(resolve, reject)();
      }), {
        log: false,
        timeout: timeout + 10000,
      });
    });
  }
}

module.exports = MailosaurCommands;
