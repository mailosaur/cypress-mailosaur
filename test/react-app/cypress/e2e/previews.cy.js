/* eslint-disable no-unused-expressions */
describe('Mailosaur previews commands', () => {
  const server = Cypress.env('MAILOSAUR_PREVIEWS_SERVER');

  describe('.mailosaurListPreviewEmailClients', () => {
    it('should list email clients', () => {
      cy.mailosaurListPreviewEmailClients().then((result) => {
        expect(result.items).to.have.lengthOf.above(1);
      });
    });
  });

  (server ? describe : describe.skip)('.mailosaurGenerateEmailPreviews', () => {
    it('should generate email previews', () => {
      cy.mailosaurCreateMessage(server, {})
        .then(email => (
          cy.mailosaurGenerateEmailPreviews(email.id, {
            previews: [{
              emailClient: 'OL2021'
            }]
          })
        ))
        .then(result => {
          expect(result.items).to.have.lengthOf.above(0);
          return cy.mailosaurDownloadPreview(result.items[0].id);
        })
        .then(file => {
          expect(file).to.be.ok;
        });
    });
  });
});
