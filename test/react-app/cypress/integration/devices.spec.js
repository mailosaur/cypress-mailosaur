/* eslint-disable no-unused-expressions */
describe('Mailosaur device commands', () => {
  const deviceName = 'My test';
  const sharedSecret = 'ONSWG4TFOQYTEMY=';

  let createdDevice;

  it('.mailosaurCreateDevice should create a new device', (done) => {
    cy.mailosaurCreateDevice({
      name: deviceName,
      sharedSecret,
    }).then((device) => {
      createdDevice = device;
      expect(createdDevice.id).to.be.ok;
      expect(createdDevice.name).to.equal(deviceName);
      done();
    });
  });

  it('.mailosaurGetDeviceOtp should retrieve an otp via device ID', (done) => {
    cy.mailosaurGetDeviceOtp(createdDevice.id).then((otpResult) => {
      expect(otpResult.code).to.be.a('string');
      expect(otpResult.code).to.have.lengthOf(6);
      done();
    });
  });

  it('.mailosaurDeleteDevice should delete an existing device', (done) => {
    cy.mailosaurListDevices().then((before) => {
      expect(before.items).to.deep.include.members([createdDevice]);
    }).then(() => (
      cy.mailosaurDeleteDevice(createdDevice.id)
    )).then(() => (
      cy.mailosaurListDevices()
    ))
      .then((after) => {
        expect(after.items).to.not.deep.include.members([createdDevice]);
        done();
      });
  });

  it('.mailosaurGetDeviceOtp should retrieve an otp via shared secret', (done) => {
    cy.mailosaurGetDeviceOtp(sharedSecret).then((otpResult) => {
      expect(otpResult.code).to.be.a('string');
      expect(otpResult.code).to.have.lengthOf(6);
      done();
    });
  });
});
