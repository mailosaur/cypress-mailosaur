/* eslint-disable no-unused-expressions */

/* eslint-disable no-unused-vars */ // TODO remove this line
const isoDateString = new Date().toISOString().slice(0, 10);

const validateHtml = (email) => {
  // Body
  assert.match(email.html.body, /^<div dir="ltr">/, 'HTML body should match');

  // Links
  assert.equal(email.html.links.length, 3, 'Should have HTML links');
  assert.equal(email.html.links[0].href, 'https://mailosaur.com/', 'First link should have href');
  assert.equal(email.html.links[0].text, 'mailosaur', 'First link should have text');
  assert.equal(email.html.links[1].href, 'https://mailosaur.com/', 'Second link should have href');
  assert.isUndefined(email.html.links[1].text, 'Second link should have no text');
  assert.equal(email.html.links[2].href, 'http://invalid/', 'Third link should have href');
  assert.equal(email.html.links[2].text, 'invalid', 'Third link should have text');

  // Images
  assert.match(email.html.images[1].src, /cid:/);
  assert.equal(email.html.images[1].alt, 'Inline image 1', 'Second image should have alt text');
};

const validateText = (email) => {
  // Body
  assert.match(email.text.body, /^this is a test/);

  // Links
  assert.equal(email.text.links.length, 2, 'Should have Text links');
  assert.equal(email.text.links[0].href, 'https://mailosaur.com/', 'First link should have href');
  assert.equal(email.text.links[0].text, email.text.links[0].href, 'First text link href & text should match');
  assert.equal(email.text.links[1].href, 'https://mailosaur.com/', 'Second link should have href');
  assert.equal(email.text.links[1].text, email.text.links[1].href, 'Second text link href & text should match');
};

const validateHeaders = (email) => {
  const expectedFromHeader = `${email.from[0].name} <${email.from[0].email}>`;
  const expectedToHeader = `${email.to[0].name} <${email.to[0].email}>`;
  const { headers } = email.metadata;

  assert.equal(headers.find(h => h.field.toLowerCase() === 'from').value, expectedFromHeader, 'From header should be accurate');
  assert.equal(headers.find(h => h.field.toLowerCase() === 'to').value, expectedToHeader, 'To header should be accurate');
  assert.equal(headers.find(h => h.field.toLowerCase() === 'subject').value, email.subject, 'Subject header should be accurate');
};

const validateMetadata = (email) => {
  assert.equal(email.from.length, 1);
  assert.equal(email.to.length, 1);
  assert.isNotEmpty(email.from[0].email, 'Sent from email is empty');
  // assert.isNotEmpty(email.from[0].name, 'Sent from name is empty'); TODO fails due to create
  assert.isNotEmpty(email.to[0].email, 'Sent to email is empty');
  // assert.isNotEmpty(email.to[0].name, 'Sent to name is empty'); TODO fails due to create
  assert.isNotEmpty(email.subject, 'Subject is empty');
  assert.isNotEmpty(email.server, 'Server is empty');
  // assert.equal(email.received.toISOString().slice(0, 10), isoDateString); TODO fails due to create
};

const validateAttachments = (email) => {
  assert.equal(email.attachments.length, 2, 'Should have attachments');

  const file1 = email.attachments[0];
  assert.isOk(file1.id, 'First attachment should have file id');
  assert.isOk(file1.url);
  assert.equal(file1.length, 82138, 'First attachment should be correct size');
  assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
  assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');

  const file2 = email.attachments[1];
  assert.isOk(file2.id, 'Second attachment should have file id');
  assert.isOk(file2.url);
  assert.equal(file2.length, 212080, 'Second attachment should be correct size');
  assert.equal(file2.fileName, 'dog.png', 'Second attachment should have filename');
  assert.equal(file2.contentType, 'image/png', 'Second attachment should have correct MIME type');
};

const validateEmail = (email) => {
  validateMetadata(email);
  // validateAttachments(email); Fails due to create
  // validateHtml(email);
  // validateText(email);
  assert.isNull(email.metadata.ehlo);
  assert.isNull(email.metadata.mailFrom);
  assert.isNotEmpty(email.metadata.rcptTo, 'rcptTo is empty');
};

const validateEmailSummary = (email) => {
  validateMetadata(email);
  assert.isNotEmpty(email.summary);
  // assert.equal(email.attachments, 2); Fails due to create
};

describe('Mailosaur message commands', () => {
  const server = Cypress.env('MAILOSAUR_SERVER');
  const verifiedDomain = Cypress.env('MAILOSAUR_VERIFIED_DOMAIN');
  let emails;

  if (!server) {
    throw new Error('You must set the MAILOSAUR_SERVER environment variable to run these tests.');
  }

  before((done) => {
    cy.mailosaurDeleteAllMessages(server)
      .mailosaurCreateMessage(server, {})
      .mailosaurCreateMessage(server, {})
      .mailosaurCreateMessage(server, {})
      .mailosaurCreateMessage(server, {})
      .mailosaurCreateMessage(server, {})
      .mailosaurListMessages(server)
      .then((result) => {
        emails = result.items;
        done();
      });
  });

  describe('.mailosaurListMessages', () => {
    it('should filter on older received after date', (done) => {
      cy.mailosaurListMessages(server, { receivedAfter: new Date(2000, 1, 1) }).then((result) => {
        expect(result.items).to.have.lengthOf(5);
        result.items.forEach(validateEmailSummary);
        done();
      });
    });

    // TODO fails due to create
    // it('should filter on received after date', (done) => {
    //   cy.mailosaurListMessages(server, { receivedAfter: new Date() }).then((result) => {
    //     expect(result.items).to.have.lengthOf(0);
    //     done();
    //   });
    // });
  });

  describe('.mailosaurGetMessage', () => {
    it('should return a match once found', (done) => {
      const testEmailAddress = `sample@${server}.mailosaur.net`;
      cy.mailosaurGetMessage(server, { sentTo: testEmailAddress }).then((result) => {
        validateEmail(result);
        done();
      });
    });
  });

  describe('.mailosaurGetMessageById', () => {
    it('should return a single email', (done) => {
      cy.mailosaurGetMessageById(emails[0].id).then((email) => {
        expect(email.subject).to.be.ok; // TODO remove after fixing create
        // validateEmail(email); TODO fails due to create
        // validateHeaders(email); TODO fails due to create
        done();
      });
    });
  });

  describe('.mailosaurGetMessagesByBody', () => {
    it('should return matching results', (done) => {
      const targetEmail = emails[1];
      cy.mailosaurGetMessagesByBody(server, 'This is a sample email').then((result) => {
        expect(result.items).to.have.lengthOf(5);
        expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
        expect(result.items[0].subject).to.equal(targetEmail.subject);
        done();
      });
    });
  });

  describe('.mailosaurGetMessagesBySentFrom', () => {
    it('should return matching results', (done) => {
      const targetEmail = emails[1];
      cy.mailosaurGetMessagesBySentFrom(server, targetEmail.from[0].email).then((result) => {
        expect(result.items).to.have.lengthOf(5);
        expect(result.items[0].from[0].email).to.equal(targetEmail.from[0].email);
        expect(result.items[0].subject).to.equal(targetEmail.subject);
        done();
      });
    });
  });

  describe('.mailosaurGetMessagesBySentTo', () => {
    it('should return matching results', (done) => {
      const targetEmail = emails[1];
      cy.mailosaurGetMessagesBySentTo(server, targetEmail.to[0].email).then((result) => {
        expect(result.items).to.have.lengthOf(5);
        expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
        expect(result.items[0].subject).to.equal(targetEmail.subject);
        done();
      });
    });
  });

  describe('.mailosaurGetMessagesBySubject', () => {
    it('should return matching results', (done) => {
      const targetEmail = emails[1];
      cy.mailosaurGetMessagesBySubject(server, 'Example message').then((result) => {
        expect(result.items).to.have.lengthOf(5);
        expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
        expect(result.items[0].subject).to.equal(targetEmail.subject);
        done();
      });
    });
  });

  describe('.mailosaurSearchMessages', () => {
    describe('by sentFrom', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        cy.mailosaurSearchMessages(server, {
          sentFrom: targetEmail.from[0].email
        }).then((result) => {
          expect(result.items).to.have.lengthOf(5);
          expect(result.items[0].from[0].email).to.equal(targetEmail.from[0].email);
          expect(result.items[0].subject).to.equal(targetEmail.subject);
          done();
        });
      });
    });

    describe('by sentTo', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        cy.mailosaurSearchMessages(server, {
          sentTo: targetEmail.to[0].email
        }).then((result) => {
          expect(result.items).to.have.lengthOf(5);
          expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
          expect(result.items[0].subject).to.equal(targetEmail.subject);
          done();
        });
      });
    });

    describe('by body', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        cy.mailosaurSearchMessages(server, { body: 'This is a sample email' }).then((result) => {
          expect(result.items).to.have.lengthOf(5);
          expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
          expect(result.items[0].subject).to.equal(targetEmail.subject);
          done();
        });
      });
    });

    describe('by subject', () => {
      it('should return matching results', (done) => {
        const targetEmail = emails[1];
        cy.mailosaurSearchMessages(server, { subject: 'Example message' }).then((result) => {
          expect(result.items).to.have.lengthOf(5);
          expect(result.items[0].to[0].email).to.equal(targetEmail.to[0].email);
          expect(result.items[0].subject).to.equal(targetEmail.subject);
          done();
        });
      });
    });

    // TODO: All message content is identical, so cannot yet run these tests
    // describe('with match all', () => {
    //   it('should return matching results', (done) => {
    //     const targetEmail = emails[1];
    //     cy.mailosaurSearchMessages(server, { subject: 'Example message', match: 'ALL' }).then((result) => {
    //       expect(result.items).to.have.lengthOf(1);
    //       done();
    //     });
    //   });
    // });

    // describe('with match any', () => {
    //   it('should return matching results', (done) => {
    //     const targetEmail = emails[1];
    //     cy.mailosaurSearchMessages(server, { subject: 'Example message', match: 'ANY' }).then((result) => {
    //       expect(result.items).to.have.lengthOf(4);
    //       done();
    //     });
    //   });
    // });

    describe('with special characters', () => {
      it('should support special characters', (done) => {
        const targetEmail = emails[1];
        cy.mailosaurSearchMessages(server, { subject: 'Search with ellipsis … and emoji 👨🏿‍🚒' }).then((result) => {
          expect(result.items).to.have.lengthOf(0);
          done();
        });
      });
    });

    describe('no results', () => {
      it('should return empty result', (done) => {
        cy.mailosaurSearchMessages(server, { subject: 'thisphrasedoesnotexist' }).then((result) => {
          expect(result.items).to.be.an('array').that.has.lengthOf(0);
          done();
        });
      });

      it('should return empty array if errors suppressed', (done) => {
        cy.mailosaurSearchMessages(server, {
          sentTo: 'neverfound@example.com'
        }, {
          timeout: 1,
          errorOnTimeout: false
        }).then((result) => {
          expect(result.items).to.be.an('array').that.has.lengthOf(0);
          done();
        });
      });
    });
  });

  describe('.mailosaurGetSpamAnalysis', () => {
    it('should perform a spam analysis on an email', (done) => {
      const targetId = emails[0].id;
      cy.mailosaurGetSpamAnalysis(targetId).then((result) => {
        result.spamFilterResults.spamAssassin.forEach((rule) => {
          expect(rule.score).to.be.a('number');
          expect(rule.rule).to.be.ok;
          expect(rule.description).to.be.ok;
        });
        done();
      });
    });
  });

  describe('.mailosaurDeleteMessage', () => {
    it('should delete an email', (done) => {
      const targetEmailId = emails[4].id;
      cy.mailosaurDeleteMessage(targetEmailId).then(done);
    });
  });

  (verifiedDomain ? describe : describe.skip)('.mailosaurCreateMessage', () => {
    it('should send with text content', (done) => {
      const subject = 'New message';
      cy.mailosaurCreateMessage(server, {
        to: `anything@${verifiedDomain}`,
        send: true,
        subject,
        text: 'This is a new email'
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.subject).to.equal(subject);
        done();
      });
    });

    it('should send with HTML content', (done) => {
      const subject = 'New message';
      cy.mailosaurCreateMessage(server, {
        to: `anything@${verifiedDomain}`,
        send: true,
        subject,
        html: '<p>This is a new email.</p>'
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.subject).to.equal(subject);
        done();
      });
    });

    it('should send with attachment', (done) => {
      const subject = 'New message with attachment';

      cy.fixture('cat.png').then(fileContent => {
        const attachment = {
          fileName: 'cat.png',
          content: fileContent,
          contentType: 'image/png'
        };

        cy.mailosaurCreateMessage(server, {
          to: `anything@${verifiedDomain}`,
          send: true,
          subject,
          html: '<p>This is a new email.</p>',
          attachments: [attachment]
        }).then((message) => {
          assert.equal(message.attachments.length, 1, 'Should have attachment');
          const file1 = message.attachments[0];
          assert.isOk(file1.id, 'First attachment should have file id');
          assert.isOk(file1.url);
          assert.equal(file1.length, 82138, 'First attachment should be correct size');
          assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
          assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');
          done();
        });
      });
    });
  });

  (verifiedDomain ? describe : describe.skip)('.mailosaurForwardMessage', () => {
    it('should forward with text content', (done) => {
      const targetEmailId = emails[0].id;
      const body = 'Forwarded message';
      cy.mailosaurForwardMessage(targetEmailId, {
        to: `anything@${verifiedDomain}`,
        text: body
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.text.body).to.contain(body);
        done();
      });
    });

    it('should forward with HTML content', (done) => {
      const targetEmailId = emails[0].id;
      const body = '<p>Forwarded <strong>HTML</strong> message.</p>';
      cy.mailosaurForwardMessage(targetEmailId, {
        to: `anything@${verifiedDomain}`,
        html: body
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.html.body).to.contain(body);
        done();
      });
    });
  });

  // TODO - Tested in Node.js client for now due to way emails are created in Cypress plugin tests
  (verifiedDomain ? describe : describe.skip)('.mailosaurReplyToMessage', () => {
    xit('should reply with text content', (done) => {
      const targetEmailId = emails[0].id;
      const body = 'Reply message';
      cy.mailosaurReplyToMessage(targetEmailId, {
        text: body
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.text.body).to.contain(body);
        done();
      });
    });

    xit('should reply with HTML content', (done) => {
      const targetEmailId = emails[0].id;
      const body = '<p>Reply <strong>HTML</strong> message.</p>';
      cy.mailosaurReplyToMessage(targetEmailId, {
        html: body
      }).then((message) => {
        expect(message.id).to.be.ok;
        expect(message.html.body).to.contain(body);
        done();
      });
    });

    xit('should reply with attachment', (done) => {
      const targetEmailId = emails[0].id;
      const body = '<p>Reply <strong>HTML</strong> message.</p>';

      cy.fixture('cat.png').then(fileContent => {
        const attachment = {
          fileName: 'cat.png',
          content: fileContent,
          contentType: 'image/png'
        };

        cy.mailosaurReplyToMessage(targetEmailId, {
          html: body,
          attachments: [attachment]
        }).then((message) => {
          assert.equal(message.attachments.length, 1, 'Should have attachment');
          const file1 = message.attachments[0];
          assert.isOk(file1.id, 'First attachment should have file id');
          assert.isOk(file1.url);
          assert.equal(file1.length, 82138, 'First attachment should be correct size');
          assert.equal(file1.fileName, 'cat.png', 'First attachment should have filename');
          assert.equal(file1.contentType, 'image/png', 'First attachment should have correct MIME type');
          done();
        });
      });
    });
  });
});
