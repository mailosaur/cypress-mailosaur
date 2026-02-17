import type {
  Device,
  DeviceListResult,
  OtpResult,
} from '../../../dist/mailosaurCommands';

describe('Mailosaur device commands', () => {
  const deviceName = 'My test';
  const sharedSecret = 'ONSWG4TFOQYTEMY=';

  let createdDevice: Device;

  it('.mailosaurCreateDevice should create a new device', done => {
    cy.mailosaurCreateDevice({
      name: deviceName,
      sharedSecret,
    }).then((device: Device) => {
      createdDevice = device;
      expect(createdDevice.id).to.be.ok;
      expect(createdDevice.name).to.equal(deviceName);
      done();
    });
  });

  it('.mailosaurGetDeviceOtp should retrieve an otp via device ID', done => {
    cy.mailosaurGetDeviceOtp(createdDevice.id!).then((otpResult: OtpResult) => {
      expect(otpResult.code).to.be.a('string');
      expect(otpResult.code).to.have.lengthOf(6);
      done();
    });
  });

  it('.mailosaurDeleteDevice should delete an existing device', done => {
    cy.mailosaurListDevices()
      .then((before: DeviceListResult) => {
        expect(before.items).to.deep.include.members([createdDevice]);
      })
      .then(() => cy.mailosaurDeleteDevice(createdDevice.id!))
      .then(() => cy.mailosaurListDevices())
      .then((after: DeviceListResult) => {
        expect(after.items).to.not.deep.include.members([createdDevice]);
        done();
      });
  });

  it('.mailosaurGetDeviceOtp should retrieve an otp via shared secret', done => {
    cy.mailosaurGetDeviceOtp(sharedSecret).then((otpResult: OtpResult) => {
      expect(otpResult.code).to.be.a('string');
      expect(otpResult.code).to.have.lengthOf(6);
      done();
    });
  });
});
