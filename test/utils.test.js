/* eslint-env mocha */
import { expect } from 'chai';
import { getFirstGivenName } from '../src/utils';

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
