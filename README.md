# Mailosaur Cypress Commands

[![](https://github.com/mailosaur/cypress-mailosaur/workflows/CI/badge.svg)](https://github.com/mailosaur/cypress-mailosaur/actions)

## Test email and SMS messages with Cypress

Using Cypress and Mailosaur together you can: 
- Test email, with unlimited test email addresses 
- Test SMS messages
- Capture emails with your very own fake SMTP servers

## What is Mailosaur?

[Mailosaur](https://mailosaur.com) is a service that lets you automate email testing (e.g. email verification, password resets, etc.) and SMS testing (e.g. one-time passwords).

Mailosaur also provides dummy SMTP servers to test with; allowing you to catch email in staging environments - preventing email being sent to customers by mistake.

## How do I test email with Cypress?

Follow these steps to start testing email with Cypress:

### Step 1 - Installation

Install the Mailosaur commands via `npm` or `yarn`:

```sh
npm i -D cypress-mailosaur
# or
yarn add -D cypress-mailosaur
```

Once downloaded, add the following line to `cypress/support/e2e.js` (or `cypress/support/index.js` in older versions of Cypress) to import the commands into your Cypress project:

```js
require('cypress-mailosaur');
```

### Step 2 - API Authentication

Mailosaur commands need your Mailosaur API key to work. You can learn about [managing API keys here](https://mailosaur.com/docs/managing-your-account/api-keys/).

#### Add API key to `cypress.config.js` 

```js
module.exports = defineConfig({
  env: {
    MAILOSAUR_API_KEY: "your-key-here",
  },

  // ...
});

```

#### Alternatively, set API key via a system environment variable

To set the environment variable on your machine, it needs to be prefixed with either `CYPRESS_` or `cypress_`.

```sh
export CYPRESS_MAILOSAUR_API_KEY=your-key-here
```

### Step 3 - Write your email test

For this example, we'll navigate to a password reset page, request a new password link (sent via email), and get that email.

Create a new test spec:

```sh
touch cypress/e2e/password-reset.cy.js
```

Now edit the file to something like this:

```js
describe('Password reset', () => {
    const serverId = 'abcd1234'
    const serverDomain = 'abcd1234.mailosaur.net'
    const emailAddress = 'password-reset@' + serverDomain

    it('Makes a Password Reset request', () => {
        cy.visit('https://github.com/password_reset')
        cy.title().should('equal', 'Forgot your password?')
        cy.get('#email_field').type(emailAddress)
    })

    it('Gets Password Reset email from Mailosaur', () => {
        cy.mailosaurGetMessage(serverId, {
            sentTo: emailAddress
        }).then(email => {
            expect(email.subject).to.equal('Reset your password');
            passwordResetLink = email.text.links[0].href;
        })
    })

    it('Follows the link from the email', () => {
        const validPassword = 'delighted cheese jolly cloud'

        cy.visit(passwordResetLink)
        cy.title().should('contain', 'Change your password')
        cy.get('#password').type(validPassword)
        cy.get('#password_confirmation').type(validPassword)
        cy.get('form').submit()
    })
})
```

### Step 4 - Write further test cases

You can test pretty much anything with Mailosaur and Cypress, including:

- [Test the text content of an email](https://mailosaur.com/docs/test-cases/text-content/)
- [Test links within an email](https://mailosaur.com/docs/test-cases/links/)
- [Working with email attachments](https://mailosaur.com/docs/test-cases/attachments/)
- [Handling images and web beacons](https://mailosaur.com/docs/test-cases/images/)
- [Perform a spam test](https://mailosaur.com/docs/test-cases/spam/)

For more information, check out the full [Mailosaur docs](https://mailosaur.com/docs/frameworks-and-tools/cypress/) for the most up-to-date guides and troubleshooting tips.

## How do I test SMS with Cypress?

Mailosaur Team, Premium, and Ultimate customers can perform SMS tests with Cypress, whilst Trial account users can just ask support to enable this feature to try it out!

SMS testing works in just the same way as email testing above. However rather than dealing with email addresses, you search using phone numbers instead. For example:

```js
cy.mailosaurGetMessage(serverId, {
    sentTo: '447555111222'
}).then(sms => {
    expect(sms.text.body).to.equal('Your OTP code is: 123456')
})
```

## Development

Install all development dependencies:

```sh
cd test/react-app
npm i
cd ../../
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
