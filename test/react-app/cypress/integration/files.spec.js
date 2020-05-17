/* eslint-disable no-unused-expressions */
describe('Mailosaur files commands', () => {
  let email;

  before((done) => {
    cy.mailosaurDeleteAllMessages('inttests')
      .mailosaurCreateMessage('inttests')
      .then((result) => {
        email = result;
        done();
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
