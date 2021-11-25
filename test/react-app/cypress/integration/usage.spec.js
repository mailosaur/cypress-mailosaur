/* eslint-disable no-unused-expressions */
describe('Mailosaur usage commands', () => {
  describe('.mailosaurGetUsageLimits', () => {
    it('should return account limits', (done) => {
      cy.mailosaurGetUsageLimits().then((result) => {
        expect(result.servers).to.be.ok;
        expect(result.users).to.be.ok;
        expect(result.email).to.be.ok;
        expect(result.sms).to.be.ok;

        expect(result.servers.limit).to.be.at.least(1);
        expect(result.users.limit).to.be.at.least(1);
        expect(result.email.limit).to.be.at.least(1);
        expect(result.sms.limit).to.be.at.least(1);
        done();
      });
    });
  });

  describe('.mailosaurGetUsageTransactions', () => {
    it('should return account limits', (done) => {
      cy.mailosaurGetUsageTransactions().then((result) => {
        expect(result.items).to.have.lengthOf.at.least(2);
        expect(result.items[0].timestamp).to.be.ok;
        expect(result.items[0].email).to.be.a('number');
        expect(result.items[0].sms).to.be.a('number');
        done();
      });
    });
  });
});
