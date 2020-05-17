const MailosaurCommands = require('./mailosaurCommands');

// TODO make based on configuration
const apiKey = 'XjORe77uYR2gBkb';

const register = (Cypress) => {
  const mailosaurCommands = new MailosaurCommands(apiKey);
  MailosaurCommands.cypressCommands.forEach((commandName) => {
    Cypress.Commands.add(
      commandName,
      mailosaurCommands[commandName].bind(mailosaurCommands)
    );
  });
};

module.exports = {
  register,
};
