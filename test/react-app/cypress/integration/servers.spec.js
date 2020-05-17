/* eslint-disable no-unused-expressions */
describe('Mailosaur server commands', () => {
  describe('.mailosaurListServers', () => {
    it('should list servers', () => {
      cy.mailosaurListServers().then((result) => {
        expect(result.items).to.have.lengthOf.above(3);
      });
    });
  });

  describe('CRUD', () => {
    const serverName = 'My test';
    let createdServer;
    let retrievedServer;

    it('.mailosaurCreateServer should create a new server', (done) => {
      cy.mailosaurCreateServer({
        name: serverName
      }).then((server) => {
        createdServer = server;
        expect(createdServer.id).to.be.ok;
        expect(createdServer.name).to.equal(serverName);
        expect(createdServer.password).to.be.ok;
        expect(createdServer.users).to.be.an('array');
        expect(createdServer.messages).to.be.a('number');
        expect(createdServer.forwardingRules).to.be.an('array');
        done();
      });
    });

    it('.mailosaurGetServer should retrieve an existing server', (done) => {
      cy.mailosaurGetServer(createdServer.id).then((server) => {
        retrievedServer = server;
          expect(retrievedServer.id).to.equal(createdServer.id);
          expect(retrievedServer.name).to.equal(createdServer.name);
          expect(retrievedServer.password).to.be.ok;
          expect(retrievedServer.users).to.be.an('array');
          expect(retrievedServer.messages).to.be.a('number');
          expect(retrievedServer.forwardingRules).to.be.an('array');
          done();
      });
    });

    it('.mailosaurUpdateServer should update an existing server', (done) => {
      retrievedServer.name += ' EDITED';
      cy.mailosaurUpdateServer(retrievedServer).then((server) => {
        expect(server.id).to.equal(retrievedServer.id);
        expect(server.name).to.equal(retrievedServer.name);
        expect(server.password).to.equal(retrievedServer.password);
        expect(server.users).to.deep.equal(retrievedServer.users);
        expect(server.messages).to.equal(retrievedServer.messages);
        expect(server.forwardingRules).to.deep.equal(retrievedServer.forwardingRules);
        done();
      });
    });

    it('.mailosaurDeleteServer should delete an existing server', (done) => {
      cy.mailosaurDeleteServer(retrievedServer.id).then(done);
    });
  });
});
