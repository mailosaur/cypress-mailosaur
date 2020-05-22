# cypress-mailosaur

This package provides [Cypress](https://cypress.io) commands to help you test email and SMS as part of end-to-end testing.

## Install and configure

### 1. Install via `npm`

```sh
npm install cypress-mailosaur --save-dev
```

### 2. Include the commands

Add the following line to `cypress/support/index.js`:

```js
import 'cypress-mailosaur'
```

### 3. Authenticate

Mailosaur commands need your Mailosaur API key to work. You can get your key via the [account settings](https://mailosaur.com/app/account/api-access) screen.

#### Option 1: Add API key to `cypress.json` 

```
{  
  "env": {
    "MAILOSAUR_API_KEY": "your-key-here"
  }
}
```

#### Option 2: Add API key to a `cypress.env.json` file

You can create your own `cypress.env.json` file that Cypress will automatically check. This is useful because if you add `cypress.env.json` to your `.gitignore` file, the values in here can be different for each developer machine.

```
{  
  "MAILOSAUR_API_KEY": "your-key-here"
}
```

#### Option 3: Set API key via a system environment variable

To set the environment variable on your machine, it needs to be prefixed with either `CYPRESS_` or `cypress_`.

```sh
export CYPRESS_MAILOSAUR_API_KEY=your-key-here
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
