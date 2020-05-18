# mailosaur-cypress

This package provides [Cypress](https://cypress.io) commands to help you test email and SMS as part of end-to-end testing.

## Install and configure

### 1. Install via `npm`

```sh
npm install mailosaur-cypress --save-dev
```

### 2. Include the commands

Add the following line to `cypress/support/index.js`:

```js
import 'mailosaur-cypress'
```

### 3. Add your Mailosaur API key as an environment variable

Mailosaur commands need your Mailosaur API key to work. We recommend that you set this using an [environment variable](https://docs.cypress.io/guides/guides/environment-variables.html):

```sh
export CYPRESS_MAILOSAUR_API_KEY=yourapikey
```

## Example usage

```js
context('Account activation', () => {
  it('should send an activation email', () => {
    cy.mailosaurGetMessage('SERVER_ID', { subject: 'Activate your account' })
      .then(email => {
        expect(email.subject).to.equal('Activate your account');
      })
      .then(email => {
        expect(email.attachments).to.have.lengthOf(0);
      })
      .then(email => {
        const $body = Cypress.$(email.html.body)
        const buttonText = $body.find('.button.button--green').text();

        expect(buttonText).to.equal('Activate now')
      })
  })
})
```

## Commands

```
mailosaurListServers()
mailosaurCreateServer({ name })
mailosaurGetServer(serverId)
mailosaurUpdateServer(serverId, server)
mailosaurDeleteServer(serverId)
mailosaurListMessages(serverId)
mailosaurCreateMessage(serverId)
mailosaurGetMessage(serverId, criteria)
mailosaurGetMessageById(messageId)
mailosaurSearchMessages(serverId, criteria, options)
mailosaurGetMessagesBySubject(serverId, subjectSearchText)
mailosaurGetMessagesByBody(serverId, bodySearchText)
mailosaurGetMessagesBySentTo(serverId, emailAddress)
mailosaurDeleteMessage(messageId)
mailosaurDeleteAllMessages(serverId)
mailosaurDownloadAttachment(attachmentId)
mailosaurDownloadMessage(messageId)
mailosaurGetSpamAnalysis(messageId)
```

### Note on parameters

- **`serverId`** - Found on the servers list within Mailosaur.
- **`server`** - A valid server object.
- **`critera`** - An object containing either `{ sentTo: 'someone@example.com' }`, `{ subject: 'Something' }` or `{ body: 'Activate your account' }`.
