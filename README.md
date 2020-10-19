# Mailosaur Cypress Commands

[Mailosaur](https://mailosaur.com) lets you automate email and SMS tests, like account verification and password resets, and integrate these into your CI/CD pipeline.

[![](https://github.com/mailosaur/cypress-mailosaur/workflows/CI/badge.svg)](https://github.com/mailosaur/cypress-mailosaur/actions)

## Install and configure

### 1. Install via `npm`

```sh
npm install cypress-mailosaur --save-dev
```

### 2. Include the commands

Add the following line to `cypress/support/index.js`:

```js
require('cypress-mailosaur');
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

## Documentation

Please see the [Cypress client reference](https://mailosaur.com/docs/email-testing/cypress/client-reference/) for the most up-to-date documentation.

## Usage

```js
context('Account activation', () => {
  it('should send an activation email', () => {
    cy.mailosaurGetMessage('SERVER_ID', { subject: 'Activate your account' })
      .then(email => {
        expect(email.subject).to.equal('Activate your account')
      })
      .then(email => {
        expect(email.attachments).to.have.lengthOf(0)
      })
      .then(email => {
        const $body = Cypress.$(email.html.body)
        const buttonText = $body.find('.button.button--green').text()

        expect(buttonText).to.equal('Activate now')
      })
  })
})
```

## Development

Install all development dependencies:

```sh
npm i
```

The test suite requires the following environment variables to be set:

```sh
export CYPRESS_MAILOSAUR_API_KEY=your_api_key
export CYPRESS_MAILOSAUR_SERVER=server_id
```

Run all tests:

```sh
npm test
```

## Contacting us

You can get us at [support@mailosaur.com](mailto:support@mailosaur.com)
