const MailosaurCommands = require('./mailosaurCommands');

const register = (Cypress) => {
  const mailosaurCommands = new MailosaurCommands();
  MailosaurCommands.cypressCommands.forEach((commandName) => {
    Cypress.Commands.add(
      commandName,
      mailosaurCommands[commandName].bind(mailosaurCommands),
    );
  });
};

module.exports = {
  register,
};
