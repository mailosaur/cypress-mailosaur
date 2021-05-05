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
      'mailosaurGenerateEmailAddress'
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
    return this.request.get(`api/servers`);
  }

  mailosaurCreateServer(params) {
    return this.request.post(`api/servers`, params);
  }

  mailosaurGetServer(serverId) {
    return this.request.get(`api/servers/${serverId}`);
  }

  mailosaurGetServerPassword(serverId) {
    return this.request.get(`api/servers/${serverId}/password`)
      .then((result) => (result.value));
  }

  mailosaurUpdateServer(server) {
    return this.request.put(`api/servers/${server.id}`, server);
  }

  mailosaurDeleteServer(serverId) {
    return this.request.del(`api/servers/${serverId}`);
  }

  mailosaurDeleteAllMessages(serverId) {
    return this.request.del(`api/messages?server=${serverId}`);
  }

  mailosaurListMessages(serverId) {
    return this.request.get(`api/messages?server=${serverId}`);
  }

  mailosaurCreateMessage(serverId) {
    return this.request.post(`api/messages?server=${serverId}`, {});
  }

  mailosaurGetMessage(server, criteria, options = {}) {
    // Only return 1 result
    options.page = 0;
    options.itemsPerPage = 1;

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

  mailosaurSearchMessages(serverId, searchCriteria, options = {}) {
    let pollCount = 0;
    const startTime = Date.now();

    const qs = {
      server: serverId,
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      receivedAfter: options.receivedAfter
    };

    if (!Number.isInteger(options.timeout)) {
      options.timeout = 0; // eslint-disable-line no-param-reassign
    }

    if (typeof options.errorOnTimeout !== 'boolean') {
      options.errorOnTimeout = true; // eslint-disable-line no-param-reassign
    }

    const fn = (resolve, reject) => () => {
      const reqOptions = this.request.buildOptions('POST', `api/messages/search`);
      reqOptions.qs = qs;
      reqOptions.json = searchCriteria;

      return Cypress.backend('http:request', reqOptions)
        .timeout(10000)
        .then((result) => {
          const { body, status, headers } = result;

          switch (status) {
            case 200:
              break;
            case 400:
              return reject(new Error(JSON.stringify(result.body)));
            case 401:
              return reject(new Error('Cannot authenticate with Mailosaur (401). Please check your API key.'));
            default:
              return reject(new Error(`Status: ${status}, Result: ${JSON.stringify(result)}`));
          }

          if (options.timeout && !body.items.length) {
            const delayPattern = (headers['x-ms-delay'] || '1000')
              .split(',')
              .map(x => parseInt(x, 10));

            const delay = (pollCount >= delayPattern.length) ?
              delayPattern[delayPattern.length - 1] :
              delayPattern[pollCount];

            pollCount += 1;

            // Stop if timeout will be exceeded
            if (((Date.now() - startTime) + delay) > options.timeout) {
              return (options.errorOnTimeout === false) ?
                resolve(body) :
                reject(new Error('No matching messages found in time. By default, only messages received in the last hour are checked (use receivedAfter to override this).'));
            }

            return setTimeout(fn(resolve, reject), delay);
          }

          resolve(body);
        });
    };

    cy.wrap(new Cypress.Promise((resolve, reject) => {
      fn(resolve, reject)();
    }), {
      log: false,
      timeout: options.timeout + 10000
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
    return this.request.get(`api/files/attachments/${attachmentId}`);
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
}

module.exports = MailosaurCommands;
