describe('Mailosaur previews commands', () => {
  let server: string;

  before(() => {
    cy.env(['MAILOSAUR_SERVER']).then(({ MAILOSAUR_SERVER }) => {
      server = MAILOSAUR_SERVER;
    });
  });

  describe('.mailosaurListPreviewEmailClients', () => {
    it('should list email clients', () => {
      cy.mailosaurListPreviewEmailClients().then(result => {
        expect(result.items).to.have.lengthOf.above(1);
      });
    });
  });

  describe('.mailosaurGenerateEmailPreviews', () => {
    it('should generate email previews', function () {
      if (!server) {
        this.skip();
      }
      cy.mailosaurCreateMessage(server, {})
        .then(email =>
          cy.mailosaurGenerateEmailPreviews(email.id!, {
            emailClients: ['iphone-16plus-applemail-lightmode-portrait'],
          })
        )
        .then(result => {
          expect(result.items).to.have.lengthOf.above(0);
          return cy.mailosaurDownloadPreview(result.items![0].id!);
        })
        .then(file => {
          expect(file).to.be.ok;
        });
    });
  });
});
