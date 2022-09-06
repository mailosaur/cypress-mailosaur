/// <reference types="cypress" />

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
    id: string;
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
    match?: "ALL" | "ANY";
}

/**
 * Message listing options
 */
export interface MessageListOptions {
    /**
     * Limits results to only messages received after this date/time (default 1 hour ago).
     */
    receivedAfter?: Date,
    /**
     * Used alongside `itemsPerPage` to paginate through results. This is zero-based, meaning `0` is the first page of results.
     */
    page?: number,
    /**
     * A limit on the number of results to be returned. This can be set between `1` and `1000`, with the default being `50`.
     */
    itemsPerPage?: number
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
export interface Server {
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
    items?: Server[];
}

/**
 * Search options
 */
export interface SearchOptions {
    /**
     * Specify how long to wait for a matching result (in milliseconds, default value is 10 seconds).
     */
    timeout?: number,
    /**
     * Limits results to only messages received after this date/time (default 1 hour ago).
     */
    receivedAfter?: Date,
    /**
     * Used alongside `itemsPerPage` to paginate through results. This is zero-based, meaning `0` is the first page of results.
     */
    page?: number,
    /**
     * A limit on the number of results to be returned. This can be set between `1` and `1000`, with the default being `50`.
     */
    itemsPerPage?: number,
    /**
     * When using the 'mailosaurGetMessage' method, this option can be used to prevent an error being thrown if no matching message is found in time.
     */
    errorOnTimeout?: boolean
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

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Returns a list of your virtual servers. Servers are returned sorted in alphabetical order.
             */
            mailosaurListServers(
            ): Cypress.Chainable<ServerListResult>;

            /**
             * Creates a new virtual server.
             */
            mailosaurCreateServer(
                /**
                 * Options used to create a new Mailosaur server.
                 */
                options: ServerCreateOptions
            ): Cypress.Chainable<Server>;

            /**
             * Retrieves the detail for a single server.
             */
            mailosaurGetServer(
                /**
                 * The unique identifier of the server.
                 */
                serverId: string
            ): Cypress.Chainable<Server>;

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
                server: Server
            ): Cypress.Chainable<Server>;

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
            ): Chainable<SpamAnalysisResult>;

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
            mailosaurGetUsageLimits(
            ): Cypress.Chainable<UsageAccountLimits>;

            /**
             * Retrieves the last 31 days of transactional usage.
             * This endpoint requires authentication with an account-level API key.
             */
            mailosaurGetUsageTransactions(
            ): Cypress.Chainable<UsageTransactionListResult>;

            /**
             * Returns a list of your virtual security devices.
             */
            mailosaurListDevices(
            ): Cypress.Chainable<DeviceListResult>;

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
        }
    }
}
