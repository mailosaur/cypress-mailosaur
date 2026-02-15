/* eslint-disable class-methods-use-this */

import Request from './request';

/**
 * Contact information for a message sender or recipient.
 */
export interface MessageAddress {
  /**
   * Display name, if one is specified.
   */
  name?: string;
  /**
   * Email address (applicable to email messages).
   */
  email?: string;
  /**
   * Phone number (applicable to SMS messages).
   */
  phone?: string;
}

/**
 * Data associated with a hyperlink found within an email or SMS message.
 */
export interface Link {
  /**
   * The URL for the link.
   */
  href?: string;
  /**
   * The display text of the link. This is particular useful for understanding how a
   * link was displayed within HTML content.
   */
  text?: string;
}

/**
 * Data associated with an automatically-extracted verification code.
 */
export interface Code {
  /**
   * The value.
   */
  value?: string;
}

/**
 * Data associated with an image found within a message.
 */
export interface Image {
  /**
   * The value of the `src` attribute of the image.
   */
  src?: string;
  /**
   * The `alt` text (alternative text), used to describe the image.
   */
  alt?: string;
}

/**
 * The content of the message.
 */
export interface MessageContent {
  /**
   * Any hyperlinks found within this content.
   */
  links?: Link[];
  /**
   * Any verification codes found within this content.
   */
  codes?: Code[];
  /**
   * Any images found within this content.
   */
  images?: Image[];
  /**
   * The HTML or plain text body of the message.
   */
  body?: string;
}

/**
 * Describes a message attachment.
 */
export interface Attachment {
  /**
   * Unique identifier for the attachment.
   */
  id?: string;
  /**
   * The MIME type of the attachment.
   */
  contentType?: string;
  /**
   * The filename of the attachment.
   */
  fileName?: string;
  /**
   * The base64-encoded content of the attachment. Note: This is only populated when sending attachments.
   */
  content?: string;
  /**
   * The content identifier (for attachments that are embedded within the body of the message).
   */
  contentId?: string;
  /**
   * The file size, in bytes.
   */
  length?: number;
  /**
   * The URL from which the attachment can be downloaded.
   */
  url?: string;
}

/**
 * Message header key/value pair.
 */
export interface MessageHeader {
  /**
   * Header key.
   */
  field?: string;
  /**
   * Header value.
   */
  value?: string;
}

/**
 * Further metadata related to the message, including email headers.
 */
export interface Metadata {
  /**
   * Message headers
   */
  headers?: MessageHeader[];
  /**
   * The fully-qualified domain name or IP address that was provided with the
   * Extended HELLO (EHLO) or HELLO (HELO) command. This value is generally
   * used to identify the SMTP client.
   * https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.1
   */
  ehlo: string;
  /**
   * The source mailbox/email address, referred to as the 'reverse-path',
   * provided via the MAIL command during the SMTP transaction.
   * https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.2
   */
  mailFrom?: string;
  /**
   * The recipient email addresses, each referred to as a 'forward-path',
   * provided via the RCPT command during the SMTP transaction.
   * https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.3
   */
  rcptTo?: MessageAddress[];
}

/**
 * The email or SMS message processed by Mailosaur.
 */
export interface Message {
  /**
   * Unique identifier for the message.
   */
  id?: string;
  /**
   * The type of message.
   */
  type: 'Email' | 'SMS';
  /**
   * The sender of the message.
   */
  from?: MessageAddress[];
  /**
   * The recipients of the message.
   */
  to?: MessageAddress[];
  /**
   * Carbon-copied recipients for email messages.
   */
  cc?: MessageAddress[];
  /**
   * Blind carbon-copied recipients for email messages.
   */
  bcc?: MessageAddress[];
  /**
   * The date/time that this message was received by Mailosaur.
   */
  received?: Date;
  /**
   * The subject of the message.
   */
  subject?: string;
  /**
   * Message content that was sent in HTML format.
   */
  html?: MessageContent;
  /**
   * Message content that was sent in plain text format.
   */
  text?: MessageContent;
  /**
   * An array of attachment metadata for any attached files.
   */
  attachments?: Attachment[];
  /**
   * Further metadata related to the message, including email headers.
   */
  metadata?: Metadata;
  /**
   * Identifier for the server in which the message is located.
   */
  server?: string;
}

/**
 * A summary of the message processed by Mailosaur. This summary does not include
 * the contents of the email or SMS message, for which you will need the full
 * message object.
 */
export interface MessageSummary {
  /**
   * Unique identifier for the message.
   */
  id: string;
  /**
   * The type of message.
   */
  type: 'Email' | 'SMS';
  /**
   * The sender of the message.
   */
  from?: MessageAddress[];
  /**
   * The recipients of the message.
   */
  to?: MessageAddress[];
  /**
   * Carbon-copied recipients for email messages.
   */
  cc?: MessageAddress[];
  /**
   * Blind carbon-copied recipients for email messages.
   */
  bcc?: MessageAddress[];
  /**
   * The date/time that this message was received by Mailosaur.
   */
  received?: Date;
  /**
   * The subject of the message.
   */
  subject?: string;
  /**
   * A short, summarized version of the message content.
   */
  summary?: string;
  /**
   * The number of attachments associated with the message.
   */
  attachments?: number;
  /**
   * Identifier for the server in which the message is located.
   */
  server?: string;
}

/**
 * The result of a message listing request.
 */
export interface MessageListResult {
  /**
   * The individual summaries of each message forming the
   * result. Summaries are returned sorted by received date, with the most
   * recently-received messages appearing first.
   */
  items?: MessageSummary[];
}

/**
 * The criteria with which to find messages during a search.
 */
export interface SearchCriteria {
  /**
   * The full email address (or phone number for SMS) from which the target message was sent.
   */
  sentFrom?: string;
  /**
   * The full email address (or phone number for SMS) to which the target message was sent.
   */
  sentTo?: string;
  /**
   * The value to seek within the subject line of a target email.
   */
  subject?: string;
  /**
   * The value to seek within the body of the target message.
   */
  body?: string;
  /**
   * If set to `ALL` (default), then only results that match all specified criteria will be returned.
   * If set to `ANY`, results that match any of the specified criteria will be returned.
   */
  match?: 'ALL' | 'ANY';
}

/**
 * Message listing options
 */
export interface MessageListOptions {
  /**
   * Limits results to only messages received after this date/time (default 1 hour ago).
   */
  receivedAfter?: Date;
  /**
   * Used alongside `itemsPerPage` to paginate through results. This is zero-based, meaning `0` is the first page of results.
   */
  page?: number;
  /**
   * A limit on the number of results to be returned. This can be set between `1` and `1000`, with the default being `50`.
   */
  itemsPerPage?: number;
  /**
   * Optionally limits results based on the direction (`Sent` or `Received`), with the default being `Received`.
   */
  dir?: string;
}

/**
 * Options to use when creating a new message.
 */
export interface MessageCreateOptions {
  /**
   * The email address to which the email will be sent. Must be a verified email address.
   */
  to?: string;
  /**
   * The email address to which the email will be CC'd. Must be a verified email address.
   */
  cc?: string;
  /**
   * Allows for the partial override of the message's 'from' address. This **must** be an address ending with `YOUR_SERVER.mailosaur.net`, such as `my-emails@a1bcdef2.mailosaur.net`.
   */
  from?: string;
  /**
   * If true, email will be sent upon creation.
   */
  send?: boolean;
  /**
   * The email subject line.
   */
  subject?: string;
  /**
   * The plain text body of the message. Note that only text or html can be supplied, not both.
   */
  text?: string;
  /**
   * The HTML body of the message. Note that only text or html can be supplied, not both.
   */
  html?: string;
  /**
   * Any message attachments.
   */
  attachments?: Attachment[];
}

/**
 * Options to use when forwarding a message.
 */
export interface MessageForwardOptions {
  /**
   * The email address to which the email will be sent. Must be a verified email address.
   */
  to: string;
  /**
   * The email address to which the email will be CC'd. Must be a verified email address.
   */
  cc?: string;
  /**
   * Any plain text to include when forwarding the message. Note that only text or html can be supplied, not both.
   */
  text?: string;
  /**
   * Any HTML content to include when forwarding the message. Note that only text or html can be supplied, not both.
   */
  html?: string;
}

/**
 * Options to use when replying to a message.
 */
export interface MessageReplyOptions {
  /**
   * The email address to which the email will be CC'd. Must be a verified email address.
   */
  cc?: string;
  /**
   * Any additional plain text content to include in the reply. Note that only text or html can be supplied, not both.
   */
  text?: string;
  /**
   * Any additional HTML content to include in the reply. Note that only html or text can be supplied, not both.
   */
  html?: string;
  /**
   * Any message attachments.
   */
  attachments?: Attachment[];
}

/**
 * Mailosaur virtual SMTP/SMS server.
 */
export interface Inbox {
  /**
   * Unique identifier for the server.
   */
  id?: string;
  /**
   * The name of the server.
   */
  name?: string;
  /**
   * Users (excluding administrators) who have access to the server (if it is restricted).
   */
  users?: string[];
  /**
   * The number of messages currently in the server.
   */
  messages?: number;
}

/**
 * Options used to create a new Mailosaur server.
 */
export interface ServerCreateOptions {
  /**
   * A name used to identify the server.
   */
  name?: string;
}

/**
 * The result of the server listing operation.
 */
export interface ServerListResult {
  /**
   * The individual servers forming the result. Servers
   * are returned sorted by creation date, with the most recently-created server
   * appearing first.
   */
  items?: Inbox[];
}

/**
 * Search options
 */
export interface SearchOptions {
  /**
   * Specify how long to wait for a matching result (in milliseconds, default value is 10 seconds).
   */
  timeout?: number;
  /**
   * Limits results to only messages received after this date/time (default 1 hour ago).
   */
  receivedAfter?: Date;
  /**
   * Used alongside `itemsPerPage` to paginate through results. This is zero-based, meaning `0` is the first page of results.
   */
  page?: number;
  /**
   * A limit on the number of results to be returned. This can be set between `1` and `1000`, with the default being `50`.
   */
  itemsPerPage?: number;
  /**
   * When using the 'mailosaurGetMessage' method, this option can be used to prevent an error being thrown if no matching message is found in time.
   */
  errorOnTimeout?: boolean;
  /**
   * Optionally limits results based on the direction (`Sent` or `Received`), with the default being `Received`.
   */
  dir?: string;
}

/**
 * The result of an individual Spam Assassin rule
 */
export interface SpamAssassinRule {
  /**
   * Spam Assassin rule score.
   */
  score?: number;
  /**
   * Spam Assassin rule name.
   */
  rule?: string;
  /**
   * Spam Assassin rule description.
   */
  description?: string;
}

/**
 * Results for this email against various spam filters.
 */
export interface SpamFilterResults {
  /**
   * Spam Assassin filter results.
   */
  spamAssassin?: SpamAssassinRule[];
}

/**
 * The results of spam analysis performed by Mailosaur.
 */
export interface SpamAnalysisResult {
  /**
   * Spam filter results.
   */
  spamFilterResults?: SpamFilterResults;
  /**
   * Overall Mailosaur spam score.
   */
  score?: number;
}

/**
 * The results of deliverability report performed by Mailosaur.
 */
export interface DeliverabilityReport {
  /**
   * The result of checking for SPF issues
   */
  spf?: EmailAuthenticationResult;
  /**
   * The result of checking for DKIM issues
   */
  dkim?: EmailAuthenticationResult[];
  /**
   * The result of checking for DMARC issues
   */
  dmarc?: EmailAuthenticationResult;
  /**
   * The result of each blocklist that was checked
   */
  blockLists?: BlockListResult[];
  /**
   * The result of content checks made on the email
   */
  content?: Content;
  /**
   * The DNS records checks made against the sender's domain
   */
  dnsRecords?: DnsRecords;
  /**
   * The result of spam analysis performed by Mailosaur
   */
  spamAssassin?: SpamAssassinResult;
}

/**
 * The result of an email domain check
 */
export interface EmailAuthenticationResult {
  /**
   * The result of the check
   */
  result?: ResultEnum;
  /**
   * A description of any issue/notes found
   */
  description?: string;
  /**
   * The raw values returned from the check
   */
  rawValue?: string;
  /**
   * The seperated tags returned from the check
   */
  tags?: { [key: string]: string };
}

/**
 * The result of an domain check against a blocklist checker
 */
export interface BlockListResult {
  /**
   * The identifier of the blocklist
   */
  id: string;
  /**
   * The name of the blocklist
   */
  name: string;
  /**
   * The result of the blocklist check
   */
  result: ResultEnum;
}

/**
 * The results of email content analysis
 */
export interface Content {
  /**
   * The content contained embed tags
   */
  embed: boolean;
  /**
   * The content contained Iframe tags
   */
  iframe: boolean;
  /**
   * The content contained object tags
   */
  object: boolean;
  /**
   * The content contained script tags
   */
  script: boolean;
  /**
   * The content contained URL's that have been shortened
   */
  shortUrls: boolean;
  /**
   * The length of all text that the content contained
   */
  textSize: number;
  /**
   * The length of all HTML that the content contained
   */
  totalSize: number;
  /**
   * Image(s) were missing "alt" properties
   */
  missingAlt: boolean;
  /**
   * The message is missing a "List-Unsubscribe" header
   */
  missingListUnsubscribe: boolean;
}

/**
 * The records found when checking DNS records of an email sender's domain
 */
export interface DnsRecords {
  /**
   * The A Records of the sender's domain
   */
  a?: string[];
  /**
   * The MX Records of the sender's domain
   */
  mx?: string[];
  /**
   * The PTR Record of the sender's domain
   */
  ptr?: string[];
}

/**
 * The results of spam assassin check performed by Mailosaur.
 */
export interface SpamAssassinResult {
  /**
   * Overall Mailosaur spam score.
   */
  score: number;
  /**
   * The result of the spam check
   */
  result: ResultEnum;
  /**
   * Spam Assassin filter rules.
   */
  rules: SpamAssassinRule[];
}

/**
 * The result of a deliverability check
 */
export enum ResultEnum {
  /**
   * The check had a positive result
   */
  Pass,
  /**
   * The check was acceptable but could be improved
   */
  Warning,
  /**
   * The check had a negative result
   */
  Fail,
  /**
   * The check was inconclusive due to a timeout
   */
  Timeout,
}

/**
 * The detail of an individual account limit.
 */
export interface UsageAccountLimit {
  /**
   * The limit for your account.
   */
  limit?: number;
  /**
   * Your account usage so far.
   */
  current?: number;
}

/**
 * The current limits and usage for your account.
 */
export interface UsageAccountLimits {
  /**
   * Server limits.
   */
  servers?: UsageAccountLimit;
  /**
   * User limits.
   */
  users?: UsageAccountLimit;
  /**
   * Emails per day limits.
   */
  email?: UsageAccountLimit;
  /**
   * SMS message per month limits.
   */
  sms?: UsageAccountLimit;
}

/**
 * Usage transaction.
 */
export interface UsageTransaction {
  /**
   * The date/time of the transaction.
   */
  timestamp?: Date;
  /**
   * The number of emails.
   */
  email?: number;
  /**
   * The number of SMS messages.
   */
  sms?: number;
}

/**
 * Usage transactions from your account.
 */
export interface UsageTransactionListResult {
  /**
   * The individual transactions that have occurred.
   */
  items?: UsageTransaction[];
}

/**
 * Mailosaur virtual security device.
 */
export interface Device {
  /**
   * Unique identifier for the device.
   */
  id?: string;
  /**
   * The name of the device.
   */
  name?: string;
}

/**
 * Options used to create a new Mailosaur virtual security device.
 */
export interface DeviceCreateOptions {
  /**
   * A name used to identify the device.
   */
  name?: string;
  /**
   * The base32-encoded shared secret for this device.
   */
  sharedSecret?: string;
}

/**
 * The result of the device listing operation.
 */
export interface DeviceListResult {
  /**
   * The individual devices forming the result.
   */
  items?: Device[];
}

/**
 * Mailosaur virtual security device OTP result.
 */
export interface OtpResult {
  /**
   * The current one-time password.
   */
  code?: string;
  /**
   * The expiry date/time of the current one-time password.
   */
  expires?: Date;
}

/**
 * Describes an email preview.
 */
export interface Preview {
  /**
   * Unique identifier for the email preview.
   */
  id?: string;
  /**
   * The email client the preview was generated with.
   */
  emailClient?: string;
  /**
   * True if images were disabled in the preview.
   */
  disableImages?: boolean;
}

/**
 * A list of requested email previews.
 */
export interface PreviewListResult {
  /**
   * The summaries for each requested preview.
   */
  items?: Preview[];
}

/**
 * Describes an email client with which email previews can be generated.
 */
export interface EmailClient {
  /**
   * The unique email client label. Used when generating email preview requests.
   */
  label?: string;
  /**
   * The display name of the email client.
   */
  name?: string;
}

/**
 * A list of available email clients with which to generate email previews.
 */
export interface EmailClientListResult {
  /**
   * A list of available email clients.
   */
  items?: EmailClient[];
}

/**
 * Preview request options.
 */
export interface PreviewRequestOptions {
  /**
   * The list email clients to generate previews with.
   */
  emailClients: string[];
}

declare const cy: any;
declare const Cypress: any;

class MailosaurCommands {
  static get cypressCommands(): string[] {
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

  private _request: Request | null;

  constructor() {
    this._request = null;
  }

  init() {
    if (this._request) {
      return cy.wrap(this._request);
    }

    return cy
      .env(['MAILOSAUR_API_KEY', 'MAILOSAUR_BASE_URL'])
      .then(
        ({
          MAILOSAUR_API_KEY: apiKey,
          MAILOSAUR_BASE_URL: baseUrl,
        }: {
          MAILOSAUR_API_KEY?: string;
          MAILOSAUR_BASE_URL?: string;
        }) => {
          this._request = new Request({ apiKey, baseUrl });
          return this._request;
        }
      );
  }

  mailosaurSetApiKey(apiKey: string) {
    return cy
      .env(['MAILOSAUR_BASE_URL'])
      .then(
        ({ MAILOSAUR_BASE_URL: baseUrl }: { MAILOSAUR_BASE_URL?: string }) => {
          this._request = new Request({ apiKey, baseUrl });
        }
      );
  }

  /**
   * Returns a list of your virtual servers. Servers are returned sorted in alphabetical order.
   */
  mailosaurListServers() {
    return this.init().then((req: Request) =>
      req.get('api/servers')
    ) as Cypress.Chainable<ServerListResult>;
  }

  /**
   * Creates a new virtual server.
   * @param options Options used to create a new Mailosaur server.
   */
  mailosaurCreateServer(options: ServerCreateOptions) {
    return this.init().then((req: Request) =>
      req.post('api/servers', options)
    ) as Cypress.Chainable<Inbox>;
  }

  /**
   * Retrieves the detail for a single server.
   * @param serverId The unique identifier of the server.
   */
  mailosaurGetServer(serverId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/servers/${serverId}`)
    ) as Cypress.Chainable<Inbox>;
  }

  /**
   * Retrieves the password for a server. This password can be used for SMTP, POP3, and IMAP connectivity.
   * @param serverId The unique identifier of the server.
   */
  mailosaurGetServerPassword(serverId: string) {
    return this.init().then((req: Request) =>
      req
        .get(`api/servers/${serverId}/password`)
        .then((result: { value: string }) => result.value)
    ) as Cypress.Chainable<string>;
  }

  /**
   * Updates the attributes of a server.
   * @param server The updated server.
   */
  mailosaurUpdateServer(server: Inbox = {}) {
    return this.init().then((req: Request) =>
      req.put(`api/servers/${server.id}`, server)
    ) as Cypress.Chainable<Inbox>;
  }

  /**
   * Permanently delete a server. This will also delete all messages, associated attachments, etc. within the server. This operation cannot be undone.
   * @param serverId The unique identifier of the server.
   */
  mailosaurDeleteServer(serverId: string) {
    return this.init().then((req: Request) =>
      req.del(`api/servers/${serverId}`)
    ) as Cypress.Chainable<null>;
  }

  /**
   * Permenantly delete all messages within a server.
   * @param serverId The unique identifier of the server.
   */
  mailosaurDeleteAllMessages(serverId: string) {
    return this.init().then((req: Request) =>
      req.del(`api/messages?server=${serverId}`)
    ) as Cypress.Chainable<null>;
  }

  /**
   * Returns a list of your messages in summary form. The summaries are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the required server.
   * @param options Message listing options.
   */
  mailosaurListMessages(serverId: string, options: MessageListOptions = {}) {
    return this.init().then((req: Request) => {
      const qs = {
        server: serverId,
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        receivedAfter: options.receivedAfter,
        dir: options.dir,
      };

      return req.get('api/messages', { qs });
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Creates a new message that can be sent to a verified email address. This is useful
   * in scenarios where you want an email to trigger a workflow in your product.
   * @param serverId The unique identifier of the required server.
   * @param options Options to use when creating a new message.
   */
  mailosaurCreateMessage(serverId: string, options: MessageCreateOptions) {
    return this.init().then((req: Request) =>
      req.post(`api/messages?server=${serverId}`, options)
    ) as Cypress.Chainable<Message>;
  }

  /**
   * Forwards the specified email to a verified email address.
   * @param messageId The unique identifier of the message to be forwarded.
   * @param options Options to use when forwarding a message.
   */
  mailosaurForwardMessage(messageId: string, options: MessageForwardOptions) {
    return this.init().then((req: Request) =>
      req.post(`api/messages/${messageId}/forward`, options)
    ) as Cypress.Chainable<Message>;
  }

  /**
   * Sends a reply to the specified message. This is useful for when simulating a user replying to one of your email or SMS messages.
   * @param messageId The unique identifier of the message to be forwarded.
   * @param options Options to use when replying to a message.
   */
  mailosaurReplyToMessage(messageId: string, options: MessageReplyOptions) {
    return this.init().then((req: Request) =>
      req.post(`api/messages/${messageId}/reply`, options)
    ) as Cypress.Chainable<Message>;
  }

  /**
   * Waits for a message to be found. Returns as soon as a message matching the specified search criteria is found.
   * **Recommended:** This is the most efficient method of looking up a message, therefore we recommend using it wherever possible.
   * @param serverId The unique identifier of the containing server.
   * @param criteria The criteria with which to find messages during a search.
   * @param options Search options.
   */
  mailosaurGetMessage(
    serverId: string,
    criteria: SearchCriteria = {},
    options: SearchOptions = {}
  ) {
    // Only return 1 result
    options.page = 0;
    options.itemsPerPage = 1;

    // Default timeout to 10s
    options.timeout = options.timeout || 10000;

    // Default receivedAfter to 1h
    options.receivedAfter =
      options.receivedAfter || new Date(Date.now() - 3600000);

    return cy
      .mailosaurSearchMessages(serverId, criteria, options)
      .then((result: MessageListResult) =>
        cy.mailosaurGetMessageById(result.items?.[0].id)
      ) as Cypress.Chainable<Message>;
  }

  /**
   * Retrieves the detail for a single message. Must be used in conjunction with either list or
   * search in order to get the unique identifier for the required message.
   * @param messageId The unique identifier of the message to be retrieved.
   */
  mailosaurGetMessageById(messageId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/messages/${messageId}`)
    ) as Cypress.Chainable<Message>;
  }

  /**
   * Returns a list of messages matching the specified search criteria, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the server to search.
   * @param searchCriteria The criteria with which to find messages during a search.
   * @param options Search options.
   */
  mailosaurSearchMessages(
    serverId: string,
    searchCriteria: SearchCriteria = {},
    options: SearchOptions = {}
  ) {
    return this.init().then((req: Request) => {
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
        options.timeout = 0;
      }

      if (typeof options.errorOnTimeout !== 'boolean') {
        options.errorOnTimeout = true;
      }

      const fn =
        (
          resolve: (value: MessageListResult) => void,
          reject: (reason?: Error) => void
        ) =>
        () => {
          const reqOptions = req.buildOptions('POST', 'api/messages/search');
          reqOptions.qs = qs;
          reqOptions.json = searchCriteria;

          return Cypress.backend('http:request', reqOptions)
            .timeout(10000)
            .then(req.getResponseHandler(true))
            .then(
              (result: {
                body: MessageListResult;
                headers: Record<string, string>;
                status: number;
              }) => {
                const { body, headers } = result;

                if (options.timeout && !body.items?.length) {
                  const delayPattern = (headers['x-ms-delay'] || '1000')
                    .split(',')
                    .map((x: string) => parseInt(x, 10));

                  const delay =
                    pollCount >= delayPattern.length
                      ? delayPattern[delayPattern.length - 1]
                      : delayPattern[pollCount];

                  pollCount += 1;

                  // Stop if timeout will be exceeded
                  if (Date.now() - startTime + delay > (options.timeout || 0)) {
                    return options.errorOnTimeout === false
                      ? resolve(body)
                      : reject(
                          new Error(
                            'No matching messages found in time. By default, only messages received in the last hour are checked ' +
                              `(use receivedAfter to override this). The search criteria used for this query was ` +
                              `[${JSON.stringify(searchCriteria)}] which timed out after ${options.timeout}ms`
                          )
                        );
                  }

                  return setTimeout(fn(resolve, reject), delay);
                }

                return resolve(body);
              }
            );
        };

      return cy.wrap(
        new Cypress.Promise(
          (
            resolve: (value: MessageListResult) => void,
            reject: (reason?: Error) => void
          ) => {
            fn(resolve, reject)();
          }
        ),
        {
          log: false,
          timeout: (options.timeout || 0) + 10000,
        }
      );
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Returns a list of messages matching the specified subject, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the server to search.
   * @param subject The value to seek within the subject line of a target email.
   */
  mailosaurGetMessagesBySubject(serverId: string, subject: string) {
    return cy.mailosaurSearchMessages(serverId, {
      subject,
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Returns a list of messages matching the specified body, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the server to search.
   * @param body The value to seek within the body of the target message.
   */
  mailosaurGetMessagesByBody(serverId: string, body: string) {
    return cy.mailosaurSearchMessages(serverId, {
      body,
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Returns a list of messages matching the specified sender, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the server to search.
   * @param sentFrom The full email address (or phone number for SMS) from which the target message was sent.
   */
  mailosaurGetMessagesBySentFrom(serverId: string, sentFrom: string) {
    return cy.mailosaurSearchMessages(serverId, {
      sentFrom,
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Returns a list of messages matching the specified recipient, in summary form.
   * The messages are returned sorted by received date, with the most recently-received messages appearing first.
   * @param serverId The unique identifier of the server to search.
   * @param sentTo The full email address (or phone number for SMS) to which the target message was sent.
   */
  mailosaurGetMessagesBySentTo(serverId: string, sentTo: string) {
    return cy.mailosaurSearchMessages(serverId, {
      sentTo,
    }) as Cypress.Chainable<MessageListResult>;
  }

  /**
   * Downloads a single attachment.
   * @param attachmentId The identifier for the required attachment.
   */
  mailosaurDownloadAttachment(attachmentId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/files/attachments/${attachmentId}`, { encoding: 'binary' })
    ) as Cypress.Chainable<unknown>;
  }

  /**
   * Downloads an EML file representing the specified email.
   * @param messageId The identifier for the required message.
   */
  mailosaurDownloadMessage(messageId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/files/email/${messageId}`)
    ) as Cypress.Chainable<string>;
  }

  /**
   * Permanently deletes a message. Also deletes any attachments related to the message. This operation cannot be undone.
   * @param messageId The identifier for the message.
   */
  mailosaurDeleteMessage(messageId: string) {
    return this.init().then((req: Request) =>
      req.del(`api/messages/${messageId}`)
    ) as Cypress.Chainable<null>;
  }

  /**
   * Perform a spam analysis of an email.
   * @param messageId The identifier of the message to be analyzed.
   */
  mailosaurGetSpamAnalysis(messageId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/analysis/spam/${messageId}`)
    ) as Cypress.Chainable<SpamAnalysisResult>;
  }

  /**
   * Perform a deliverability report of an email.
   * @param messageId The identifier of the message to be analyzed.
   */
  mailosaurGetDeliverabilityReport(messageId: string) {
    return this.init().then((req: Request) =>
      req.get(`api/analysis/deliverability/${messageId}`)
    ) as Cypress.Chainable<DeliverabilityReport>;
  }

  /**
   * Generates a random email address by appending a random string in front of the server's
   * domain name.
   * @param serverId The identifier of the server.
   */
  mailosaurGenerateEmailAddress(serverId: string) {
    return cy
      .env(['MAILOSAUR_SMTP_HOST'])
      .then(
        ({ MAILOSAUR_SMTP_HOST: host }: { MAILOSAUR_SMTP_HOST?: string }) => {
          const actualHost = host || 'mailosaur.net';
          const random = (Math.random() + 1).toString(36).substring(7);
          return cy.wrap(`${random}@${serverId}.${actualHost}`);
        }
      ) as Cypress.Chainable<string>;
  }

  /**
   * Retrieve account usage limits. Details the current limits and usage for your account.
   * This endpoint requires authentication with an account-level API key.
   */
  mailosaurGetUsageLimits() {
    return this.init().then((req: Request) =>
      req.get('api/usage/limits')
    ) as Cypress.Chainable<UsageAccountLimits>;
  }

  /**
   * Retrieves the last 31 days of transactional usage.
   * This endpoint requires authentication with an account-level API key.
   */
  mailosaurGetUsageTransactions() {
    return this.init().then((req: Request) =>
      req.get('api/usage/transactions')
    ) as Cypress.Chainable<UsageTransactionListResult>;
  }

  /**
   * Returns a list of your virtual security devices.
   */
  mailosaurListDevices() {
    return this.init().then((req: Request) =>
      req.get('api/devices')
    ) as Cypress.Chainable<DeviceListResult>;
  }

  /**
   * Creates a new virtual security device.
   * @param options Options used to create a new Mailosaur virtual security device.
   */
  mailosaurCreateDevice(options: DeviceCreateOptions) {
    return this.init().then((req: Request) =>
      req.post('api/devices', options)
    ) as Cypress.Chainable<Device>;
  }

  /**
   * Retrieves the current one-time password for a saved device, or given base32-encoded shared secret.
   * @param query Either the unique identifier of the device, or a base32-encoded shared secret.
   */
  mailosaurGetDeviceOtp(query: string) {
    return this.init().then((req: Request) => {
      if (!query || query.indexOf('-') > -1) {
        return req.get(`api/devices/${query}/otp`);
      }

      return req.post('api/devices/otp', {
        sharedSecret: query,
      });
    }) as Cypress.Chainable<OtpResult>;
  }

  /**
   * Permanently delete a device. This operation cannot be undone.
   * @param deviceId The unique identifier of the device.
   */
  mailosaurDeleteDevice(deviceId: string) {
    return this.init().then((req: Request) =>
      req.del(`api/devices/${deviceId}`)
    ) as Cypress.Chainable<null>;
  }

  /**
   * List all email clients that can be used to generate email previews.
   */
  mailosaurListPreviewEmailClients() {
    return this.init().then((req: Request) =>
      req.get('api/screenshots/clients')
    ) as Cypress.Chainable<EmailClientListResult>;
  }

  /**
   * Generates screenshots of an email rendered in the specified email clients.
   * @param messageId The identifier of the email to preview.
   * @param options The options with which to generate previews.
   */
  mailosaurGenerateEmailPreviews(
    messageId: string,
    options: PreviewRequestOptions
  ) {
    return this.init().then((req: Request) =>
      req.post(`api/messages/${messageId}/screenshots`, options)
    ) as Cypress.Chainable<PreviewListResult>;
  }

  /**
   * Downloads a screenshot of your email rendered in a real email client. Simply supply
   * the unique identifier for the required preview.
   * @param previewId The identifier of the email preview to be downloaded.
   */
  mailosaurDownloadPreview(previewId: string) {
    return this.init().then((req: Request) => {
      const timeout = 120000;
      let pollCount = 0;
      const startTime = Date.now();

      const fn =
        (resolve: (value: unknown) => void, reject: (reason?: Error) => void) =>
        () => {
          const reqOptions = req.buildOptions(
            'GET',
            `api/files/screenshots/${previewId}`
          );
          reqOptions.encoding = 'binary';

          return Cypress.backend('http:request', reqOptions)
            .timeout(timeout)
            .then(req.getResponseHandler(true))
            .then(
              (result: {
                body: unknown;
                headers: Record<string, string>;
                status: number;
              }) => {
                const { body, headers, status } = result;

                if (status === 200) {
                  return resolve(body);
                }

                if (status !== 202) {
                  return reject(
                    new Error(
                      `Failed to download preview. Status code: ${status}`
                    )
                  );
                }

                const delayPattern = (headers['x-ms-delay'] || '1000')
                  .split(',')
                  .map((x: string) => parseInt(x, 10));

                const delay =
                  pollCount >= delayPattern.length
                    ? delayPattern[delayPattern.length - 1]
                    : delayPattern[pollCount];

                pollCount += 1;

                // Stop if timeout will be exceeded
                if (Date.now() - startTime + delay > timeout) {
                  return reject(
                    new Error(
                      `An email preview was not generated in time. The email client may not be available, or the preview ID ` +
                        `[${previewId}] may be incorrect.`
                    )
                  );
                }

                return setTimeout(fn(resolve, reject), delay);
              }
            );
        };

      return cy.wrap(
        new Cypress.Promise(
          (
            resolve: (value: unknown) => void,
            reject: (reason?: Error) => void
          ) => {
            fn(resolve, reject)();
          }
        ),
        {
          log: false,
          timeout: timeout + 10000,
        }
      );
    }) as Cypress.Chainable<unknown>;
  }
}

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Returns a list of your virtual servers. Servers are returned sorted in alphabetical order.
       */
      mailosaurListServers(): Cypress.Chainable<ServerListResult>;

      /**
       * Creates a new virtual server.
       */
      mailosaurCreateServer(
        /**
         * Options used to create a new Mailosaur server.
         */
        options: ServerCreateOptions
      ): Cypress.Chainable<Inbox>;

      /**
       * Retrieves the detail for a single server.
       */
      mailosaurGetServer(
        /**
         * The unique identifier of the server.
         */
        serverId: string
      ): Cypress.Chainable<Inbox>;

      /**
       * Retrieves the password for a server. This password can be used for SMTP, POP3, and IMAP connectivity.
       */
      mailosaurGetServerPassword(
        /**
         * The unique identifier of the server.
         */
        serverId: string
      ): Cypress.Chainable<string>;

      /**
       * Updates the attributes of a server.
       */
      mailosaurUpdateServer(
        /**
         * The updated server.
         */
        server: Inbox
      ): Cypress.Chainable<Inbox>;

      /**
       * Permanently delete a server. This will also delete all messages, associated attachments, etc. within the server. This operation cannot be undone.
       */
      mailosaurDeleteServer(
        /**
         * The unique identifier of the server.
         */
        serverId: string
      ): Cypress.Chainable<null>;

      /**
       * Permenantly delete all messages within a server.
       */
      mailosaurDeleteAllMessages(
        /**
         * The unique identifier of the server.
         */
        serverId: string
      ): Cypress.Chainable<null>;

      /**
       * Returns a list of your messages in summary form. The summaries are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurListMessages(
        /**
         * The unique identifier of the required server.
         */
        serverId: string,
        /**
         * Message listing options
         */
        options?: MessageListOptions
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Creates a new message that can be sent to a verified email address. This is useful
       * in scenarios where you want an email to trigger a workflow in your product.
       */
      mailosaurCreateMessage(
        /**
         * The unique identifier of the required server.
         */
        serverId: string,
        /**
         * Options to use when creating a new message.
         */
        options: MessageCreateOptions
      ): Cypress.Chainable<Message>;

      /**
       * Forwards the specified email to a verified email address.
       */
      mailosaurForwardMessage(
        /**
         * The unique identifier of the message to be forwarded.
         */
        messageId: string,
        /**
         * Options to use when forwarding a message.
         */
        options: MessageForwardOptions
      ): Cypress.Chainable<Message>;

      /**
       * Sends a reply to the specified message. This is useful for when simulating a user replying to one of your email or SMS messages.
       */
      mailosaurReplyToMessage(
        /**
         * The unique identifier of the message to be forwarded.
         */
        messageId: string,
        /**
         * Options to use when replying to a message.
         */
        options: MessageReplyOptions
      ): Cypress.Chainable<Message>;

      /**
       * Waits for a message to be found. Returns as soon as a message matching the specified search criteria is found.
       * **Recommended:** This is the most efficient method of looking up a message, therefore we recommend using it wherever possible.
       */
      mailosaurGetMessage(
        /**
         * The unique identifier of the containing server.
         */
        serverId: string,
        /**
         * The criteria with which to find messages during a search.
         */
        criteria: SearchCriteria,
        /**
         * Search options
         */
        options?: SearchOptions
      ): Cypress.Chainable<Message>;

      /**
       * Retrieves the detail for a single message. Must be used in conjunction with either list or
       * search in order to get the unique identifier for the required message.
       */
      mailosaurGetMessageById(
        /**
         * The unique identifier of the message to be retrieved.
         */
        messageId: string
      ): Cypress.Chainable<Message>;

      /**
       * Returns a list of messages matching the specified search criteria, in summary form.
       * The messages are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurSearchMessages(
        /**
         * The unique identifier of the server to search.
         */
        serverId: string,
        /**
         * The criteria with which to find messages during a search.
         */
        criteria: SearchCriteria,
        /**
         * Search options
         */
        options?: SearchOptions
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Returns a list of messages matching the specified subject, in summary form.
       * The messages are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurGetMessagesBySubject(
        /**
         * The unique identifier of the server to search.
         */
        serverId: string,
        /**
         * The value to seek within the subject line of a target email.
         */
        subject: string
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Returns a list of messages matching the specified body, in summary form.
       * The messages are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurGetMessagesByBody(
        /**
         * The unique identifier of the server to search.
         */
        serverId: string,
        /**
         * The value to seek within the body of the target message.
         */
        body: string
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Returns a list of messages matching the specified sender, in summary form.
       * The messages are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurGetMessagesBySentFrom(
        /**
         * The unique identifier of the server to search.
         */
        serverId: string,
        /**
         * The full email address (or phone number for SMS) from which the target message was sent.
         */
        sentFrom: string
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Returns a list of messages matching the specified recipient, in summary form.
       * The messages are returned sorted by received date, with the most recently-received messages appearing first.
       */
      mailosaurGetMessagesBySentTo(
        /**
         * The unique identifier of the server to search.
         */
        serverId: string,
        /**
         * The full email address (or phone number for SMS) to which the target message was sent.
         */
        sentTo: string
      ): Cypress.Chainable<MessageListResult>;

      /**
       * Generates screenshots of an email rendered in the specified email clients.
       */
      mailosaurGenerateEmailPreviews(
        /**
         * The identifier of the email to preview.
         */
        messageId: string,
        /**
         * The options with which to generate previews.
         */
        options: PreviewRequestOptions
      ): Cypress.Chainable<PreviewListResult>;

      /**
       * Downloads a single attachment.
       */
      mailosaurDownloadAttachment(
        /**
         * The identifier for the required attachment.
         */
        attachmentId: string
      ): Cypress.Chainable<unknown>;

      /**
       * Downloads an EML file representing the specified email.
       */
      mailosaurDownloadMessage(
        /**
         * The identifier for the required message.
         */
        messageId: string
      ): Cypress.Chainable<string>;

      /**
       * Downloads a screenshot of your email rendered in a real email client. Simply supply
       * the unique identifier for the required preview.
       */
      mailosaurDownloadPreview(
        /**
         * The identifier of the email preview to be downloaded.
         */
        previewId: string
      ): Cypress.Chainable<unknown>;

      /**
       * Permanently deletes a message. Also deletes any attachments related to the message. This operation cannot be undone.
       */
      mailosaurDeleteMessage(
        /**
         * The identifier for the message.
         */
        messageId: string
      ): Cypress.Chainable<null>;

      /**
       * Perform a spam analysis of an email.
       */
      mailosaurGetSpamAnalysis(
        /**
         * The identifier of the message to be analyzed.
         */
        messageId: string
      ): Cypress.Chainable<SpamAnalysisResult>;

      /**
       * Perform a deliverability report of an email.
       */
      mailosaurGetDeliverabilityReport(
        /**
         * The identifier of the message to be analyzed.
         */
        messageId: string
      ): Cypress.Chainable<DeliverabilityReport>;

      /**
       * Generates a random email address by appending a random string in front of the server's
       * domain name.
       */
      mailosaurGenerateEmailAddress(
        /**
         * The identifier of the server.
         */
        serverId: string
      ): Cypress.Chainable<string>;

      /**
       * Retrieve account usage limits. Details the current limits and usage for your account.
       * This endpoint requires authentication with an account-level API key.
       */
      mailosaurGetUsageLimits(): Cypress.Chainable<UsageAccountLimits>;

      /**
       * Retrieves the last 31 days of transactional usage.
       * This endpoint requires authentication with an account-level API key.
       */
      mailosaurGetUsageTransactions(): Cypress.Chainable<UsageTransactionListResult>;

      /**
       * Returns a list of your virtual security devices.
       */
      mailosaurListDevices(): Cypress.Chainable<DeviceListResult>;

      /**
       * Creates a new virtual security device.
       */
      mailosaurCreateDevice(
        /**
         * Options used to create a new Mailosaur virtual security device.
         */
        options: DeviceCreateOptions
      ): Cypress.Chainable<Device>;

      /**
       * Retrieves the current one-time password for a saved device, or given base32-encoded shared secret.
       */
      mailosaurGetDeviceOtp(
        /**
         * Either the unique identifier of the device, or a base32-encoded shared secret.
         */
        query: string
      ): Cypress.Chainable<OtpResult>;

      /**
       * Permanently delete a device. This operation cannot be undone.
       */
      mailosaurDeleteDevice(
        /**
         * The unique identifier of the device.
         */
        deviceId: string
      ): Cypress.Chainable<null>;

      /**
       * List all email clients that can be used to generate email previews.
       */
      mailosaurListPreviewEmailClients(): Cypress.Chainable<EmailClientListResult>;
    }
  }
}

export default MailosaurCommands;
