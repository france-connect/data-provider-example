/* eslint-env mocha */
import { expect } from 'chai';
import { getAccessTokenFromAuthorizationHeader, getFirstGivenName } from '../src/utils';

describe('getAccessTokenFromAuthorizationHeader', () => {
  it('should return null if no header is provided', () => {
    expect(getAccessTokenFromAuthorizationHeader(undefined)).to.equal(null);
  });
  it('should return null if header has no authentication scheme', () => {
    expect(getAccessTokenFromAuthorizationHeader('fake-access-token')).to.equal(null);
  });
  it('should return null if header has no credentials', () => {
    expect(getAccessTokenFromAuthorizationHeader('Bearer')).to.equal(null);
  });
  it('should return null if header has wrong authentication scheme', () => {
    expect(getAccessTokenFromAuthorizationHeader('Basic fake-access-token')).to.equal(null);
  });
  it('should return the access token if header has the correct format', () => {
    expect(getAccessTokenFromAuthorizationHeader('Bearer fake-access-token')).to.equal('fake-access-token');
  });
  it('should be compliant with production DGFiP API', () => {
    expect(getAccessTokenFromAuthorizationHeader('Bearer: fake-access-token')).to.equal('fake-access-token');
  });
});

describe('getFirstGivenName', () => {
  it('should return the first given name within 3 names', () => {
    const givenName = 'Stéphane Louis Perceval';

    expect(getFirstGivenName(givenName)).to.equal('Stéphane');
  });

  it('should return the first given name within 1 name', () => {
    const givenName = 'Stéphane';

    expect(getFirstGivenName(givenName)).to.equal('Stéphane');
  });
});
