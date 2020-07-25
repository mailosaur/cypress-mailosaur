const Request = require('./request');

class MailosaurCommands {
  static get cypressCommands() {
    return [
      'mailosaurListServers',
      'mailosaurCreateServer',
      'mailosaurGetServer',
      'mailosaurUpdateServer',
      'mailosaurDeleteServer',
      'mailosaurListMessages',
      'mailosaurCreateMessage',
      'mailosaurGetMessage',
      'mailosaurGetMessageById',
      'mailosaurSearchMessages',
      'mailosaurGetMessagesBySubject',
      'mailosaurGetMessagesByBody',
      'mailosaurGetMessagesBySentTo',
      'mailosaurDeleteMessage',
      'mailosaurDeleteAllMessages',
      'mailosaurDownloadAttachment',
      'mailosaurDownloadMessage',
      'mailosaurGetSpamAnalysis'
    ];
  }

  constructor() {
    const apiKey = Cypress.env('MAILOSAUR_API_KEY');
    if (!apiKey) {
      // CYPRESS_ prefix necessary per https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS
      throw new Error('You must set the CYPRESS_MAILOSAUR_API_KEY environment variable to use the Mailosaur plugin.');
    }

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


    const fn = (resolve, reject) => () => {
      const reqOptions = this.request.buildOptions('POST', `api/messages/search`);
      reqOptions.qs = qs;
      reqOptions.json = searchCriteria;

      return Cypress.backend('http:request', reqOptions)
        .timeout(10000)
        .then((result) => {
          const { body, status, headers } = result;

          if (status !== 200) {
            return reject(new Error(result));
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
              return (options.suppressError === true) ?
                resolve(body) :
                reject(new Error('No matching messages were found in time'));
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
}

module.exports = MailosaurCommands;
