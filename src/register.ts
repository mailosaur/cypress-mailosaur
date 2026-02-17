import MailosaurCommands from './mailosaurCommands';

export const register = (Cypress: any): void => {
  const mailosaurCommands = new MailosaurCommands();
  const commandMap = mailosaurCommands as unknown as Record<
    string,
    (...args: unknown[]) => unknown
  >;
  MailosaurCommands.cypressCommands.forEach(commandName => {
    Cypress.Commands.add(
      commandName,
      commandMap[commandName].bind(mailosaurCommands)
    );
  });
};
