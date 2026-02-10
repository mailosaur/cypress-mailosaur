/* eslint-disable no-unused-expressions */
describe('Mailosaur files commands', () => {
  let server;
  let email;

  before(() => {
    cy.env(['MAILOSAUR_SERVER']).then(({ MAILOSAUR_SERVER }) => {
      server = MAILOSAUR_SERVER;
      if (!server) {
        throw new Error('You must set the MAILOSAUR_SERVER environment variable to run these tests.');
      }

      cy.mailosaurDeleteAllMessages(server)
        .mailosaurCreateMessage(server, {})
        .then((result) => {
          email = result;
        });
    });
  });

  describe('.mailosaurDownloadAttachment', () => {
    // TODO Fails due to create
    // it('should return a file', (done) => {
    //   const attachment = email.attachments[0];

    //   cy.mailosaurDownloadAttachment(attachment.id).then((result) => {
    //     expect(result).to.be.ok;
    //     expect(result).to.have.lengthOf(attachment.length);
    //     done();
    //   });
    // });
  });

  describe('.mailosaurDownloadMessage', () => {
    it('should return a file', (done) => {
      cy.mailosaurDownloadMessage(email.id).then((result) => {
        expect(result).to.be.ok;
        expect(result).to.have.lengthOf.above(1);
        expect(result).to.contain(email.subject);
        done();
      });
    });
  });
});
