/// <reference types="cypress" />

/**
 * @class
 * Initializes a new instance of the SpamAssassinRule class.
 * @constructor
 * @member {number} [score]
 * @member {string} [rule]
 * @member {string} [description]
 */
export interface SpamAssassinRule {
    score?: number;
    rule?: string;
    description?: string;
}

/**
 * @class
 * Initializes a new instance of the SpamFilterResults class.
 * @constructor
 * @member {array} [spamAssassin]
 */
export interface SpamFilterResults {
    spamAssassin?: SpamAssassinRule[];
}

/**
 * @class
 * Initializes a new instance of the SpamAnalysisResult class.
 * @constructor
 * @member {object} [spamFilterResults]
 * @member {array} [spamFilterResults.spamAssassin]
 * @member {number} [score]
 */
export interface SpamAnalysisResult {
    spamFilterResults?: SpamFilterResults;
    score?: number;
}

/**
 * @class
 * Initializes a new instance of the MessageAddress class.
 * @constructor
 * @member {string} [name] Display name, if one is specified.
 * @member {string} [email] Email address (applicable to email messages).
 * @member {string} [phone] Phone number (applicable to SMS messages).
 */
export interface MessageAddress {
    name?: string;
    email?: string;
    phone?: string;
}

/**
 * @class
 * Initializes a new instance of the Link class.
 * @constructor
 * @member {string} [href]
 * @member {string} [text]
 */
export interface Link {
    href?: string;
    text?: string;
}

/**
 * @class
 * Initializes a new instance of the Image class.
 * @constructor
 * @member {string} [src]
 * @member {string} [alt]
 */
export interface Image {
    src?: string;
    alt?: string;
}

/**
 * @class
 * Initializes a new instance of the MessageContent class.
 * @constructor
 * @member {array} [links]
 * @member {array} [images]
 * @member {string} [body]
 */
export interface MessageContent {
    links?: Link[];
    images?: Image[];
    body?: string;
}

/**
 * @class
 * Initializes a new instance of the Attachment class.
 * @constructor
 * @member {uuid} id
 * @member {string} [contentType]
 * @member {string} [fileName]
 * @member {string} [contentId]
 * @member {number} [length]
 * @member {string} [url]
 */
export interface Attachment {
    id: string;
    contentType?: string;
    fileName?: string;
    contentId?: string;
    length?: number;
    url?: string;
}

/**
 * @class
 * Initializes a new instance of the MessageHeader class.
 * @constructor
 * @member {string} [field] Header key.
 * @member {string} [value] Header value.
 */
export interface MessageHeader {
    field?: string;
    value?: string;
}

/**
 * @class
 * Initializes a new instance of the Metadata class.
 * @constructor
 * Advanced use case content related to the message.
 *
 * @member {array} [headers] Email headers.
 */
export interface Metadata {
    headers?: MessageHeader[];
}

/**
 * @class
 * Initializes a new instance of the Message class.
 * @constructor
 * @member {uuid} [id] Unique identifier for the message.
 * @member {array} [from] The sender of the message.
 * @member {array} [to] The message’s recipient.
 * @member {array} [cc] Carbon-copied recipients for email messages.
 * @member {array} [bcc] Blind carbon-copied recipients for email messages.
 * @member {date} [received] The datetime that this message was received by
 * Mailosaur.
 * @member {string} [subject] The message’s subject.
 * @member {object} [html] Message content that was sent in HTML format.
 * @member {array} [html.links]
 * @member {array} [html.images]
 * @member {string} [html.body]
 * @member {object} [text] Message content that was sent in plain text format.
 * @member {array} [text.links]
 * @member {array} [text.images]
 * @member {string} [text.body]
 * @member {array} [attachments] An array of attachment metadata for any
 * attached files.
 * @member {object} [metadata]
 * @member {array} [metadata.headers] Email headers.
 * @member {string} [server] Identifier for the server in which the message is
 * located.
 */
export interface Message {
    id?: string;
    from?: MessageAddress[];
    to?: MessageAddress[];
    cc?: MessageAddress[];
    bcc?: MessageAddress[];
    received?: Date;
    subject?: string;
    html?: MessageContent;
    text?: MessageContent;
    attachments?: Attachment[];
    metadata?: Metadata;
    server?: string;
}

/**
 * @class
 * Initializes a new instance of the MessageSummary class.
 * @constructor
 * @member {uuid} id
 * @member {string} [server]
 * @member {array} [rcpt]
 * @member {array} [from]
 * @member {array} [to]
 * @member {array} [cc]
 * @member {array} [bcc]
 * @member {date} [received]
 * @member {string} [subject]
 * @member {string} [summary]
 * @member {number} [attachments]
 */
export interface MessageSummary {
    id: string;
    server?: string;
    rcpt?: MessageAddress[];
    from?: MessageAddress[];
    to?: MessageAddress[];
    cc?: MessageAddress[];
    bcc?: MessageAddress[];
    received?: Date;
    subject?: string;
    summary?: string;
    attachments?: number;
}

/**
 * @class
 * Initializes a new instance of the MessageListResult class.
 * @constructor
 * The result of a message listing request.
 *
 * @member {array} [items] The individual summaries of each message forming the
 * result. Summaries are returned sorted by received date, with the most
 * recently-received messages appearing first.
 */
export interface MessageListResult {
    items?: MessageSummary[];
}

/**
 * @class
 * Initializes a new instance of the SearchCriteria class.
 * @constructor
 * @member {string} [sentFrom] The full email address from which the target email
 * was sent.
 * @member {string} [sentTo] The full email address to which the target email
 * was sent.
 * @member {string} [subject] The value to seek within the target email's
 * subject line.
 * @member {string} [body] The value to seek within the target email's HTML or
 * text body.
 * @member {string} [match] If set to ALL (default), then only results that match all
 * specified criteria will be returned. If set to ANY, results that match any of the
 * specified criteria will be returned.
 */
export interface SearchCriteria {
    sentFrom?: string;
    sentTo?: string;
    subject?: string;
    body?: string;
    match?: "ALL" | "ANY";
}

/**
 * @class
 * Initializes a new instance of the Server class.
 * @constructor
 * @member {string} [id] Unique identifier for the server. Used as username for
 * SMTP/POP3 authentication.
 * @member {string} [name] A name used to identify the server.
 * @member {array} [users] Users (excluding administrators) who have access to
 * the server.
 * @member {number} [messages] The number of messages currently in the server.
 */
export interface Server {
    id?: string;
    name?: string;
    users?: string[];
    messages?: number;
}

/**
 * @class
 * Initializes a new instance of the ServerListResult class.
 * @constructor
 * The result of a server listing request.
 *
 * @member {array} [items] The individual servers forming the result. Servers
 * are returned sorted by creation date, with the most recently-created server
 * appearing first.
 */
export interface ServerListResult {
    items?: Server[];
}

/**
 * @class
 * Initializes a new instance of the ServerCreateOptions class.
 * @constructor
 * @member {string} [name] A name used to identify the server.
 */
export interface ServerCreateOptions {
    name?: string;
}

export interface SearchOptions {
    timeout?: number,
    receivedAfter?: Date,
    page?: number,
    itemsPerPage?: number,
    suppressError?: boolean
}

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * @summary List all servers
             *
             * Returns a list of your virtual SMTP servers. Servers are returned sorted in
             * alphabetical order.
             *
             */
            mailosaurListServers(
            ): Cypress.Chainable<ServerListResult>;

            mailosaurCreateServer(
                options: ServerCreateOptions
            ): Cypress.Chainable<Server>;

            mailosaurGetServer(
                serverId: string
            ): Cypress.Chainable<Server>;

            mailosaurGetServerPassword(
                serverId: string
            ): Cypress.Chainable<string>;

            mailosaurUpdateServer(
                server: Server
            ): Cypress.Chainable<Server>;

            mailosaurDeleteServer(
                serverId: string
            ): Cypress.Chainable<null>;

            mailosaurDeleteAllMessages(
                serverId: string
            ): Cypress.Chainable<null>;

            mailosaurListMessages(
                serverId: string
            ): Cypress.Chainable<MessageListResult>;

            mailosaurCreateMessage(
                serverId: string
            ): Cypress.Chainable<Message>;

            mailosaurGetMessage(
                serverId: string,
                criteria: SearchCriteria,
                options?: SearchOptions
            ): Cypress.Chainable<Message>;

            mailosaurGetMessageById(
                messageId: string
            ): Cypress.Chainable<Message>;

            mailosaurSearchMessages(
                serverId: string,
                criteria: SearchCriteria,
                options?: SearchOptions
            ): Cypress.Chainable<MessageListResult>;

            mailosaurGetMessagesBySubject(
                serverId: string,
                subject: string
            ): Cypress.Chainable<MessageListResult>;

            mailosaurGetMessagesByBody(
                serverId: string,
                body: string
            ): Cypress.Chainable<MessageListResult>;

            mailosaurGetMessagesBySentFrom(
                serverId: string,
                sentFrom: string
            ): Cypress.Chainable<MessageListResult>;

            mailosaurGetMessagesBySentTo(
                serverId: string,
                sentTo: string
            ): Cypress.Chainable<MessageListResult>;

            mailosaurDownloadAttachment(
                attachmentId: string
            ): Cypress.Chainable<Attachment>;

            mailosaurDownloadMessage(
                messageId: string
            ): Cypress.Chainable<string>;

            mailosaurDeleteMessage(
                messageId: string
            ): Cypress.Chainable<null>;

            /**
             * @summary Perform a spam test
             *
             * Perform spam testing on the specified email
             *
             * @param {string} messageId The identifier of the email to be analyzed.
             *
             * @returns {Chainable<SpamAnalysisResult>}
             */
            mailosaurGetSpamAnalysis(
                messageId: string
            ): Chainable<SpamAnalysisResult>;

            mailosaurGenerateEmailAddress(
                serverId: string
            ): Cypress.Chainable<string>;
        }

    }
}
