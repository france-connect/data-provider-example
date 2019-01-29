/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
import { expect } from 'chai';
import {
  filter, format, isAuthorized, reconcile,
} from '../src/services';

describe('isAuthorized', () => {
  it('should return not authorized for insufficient scope', () => {
    const notAuthorizedToken = { scope: ['scope_1', 'scope_2'] };

    expect(isAuthorized(notAuthorizedToken.scope)).to.be.false;
  });

  it('should return authorized', () => {
    const notAuthorizedToken = { scope: ['scope_1', 'scope_2', 'dgfip_pac'] };

    expect(isAuthorized(notAuthorizedToken.scope)).to.be.true;
  });
});

describe('filter', () => {
  it('should filter data according to user scopes', () => {
    const databaseEntry = {
      dataNotToBeReturn: '0',
      nombreDePersonnesACharge: '0',
      nombreDePersonnesAChargeF: '0',
    };

    const userScopes = ['scope_1', 'scope_2', 'dgfip_pac'];

    expect(filter(userScopes, databaseEntry).dataNotToBeReturn).to.be.undefined;
  });

  it('should return data when different scopes refer to the same properties', () => {
    const databaseEntry = {
      dataNotToBeReturn: '0',
      nombreDePersonnesACharge: '0',
      nombreDePersonnesAChargeF: '0',
    };

    const userScopes = ['dgfip_pac', 'dgfip_pacf'];

    expect(filter(userScopes, databaseEntry)).to.deep.equal({
      nombreDePersonnesACharge: '0',
      nombreDePersonnesAChargeF: '0',
    });
  });
});

describe('format', () => {
  it('should return dgfip labels from database entry labels', () => {
    const databaseEntry = {
      revenuFiscalDeReference: '12345',
    };

    expect(format(databaseEntry)).to.deep.equal({
      rfr: '12345',
    });
  });

  it('should structure data within sub-objects', () => {
    const databaseEntry = {
      adresseFiscaleDeTaxationComplementAdresse: '',
      adresseFiscaleDeTaxationVoie: '20 avenue de Ségur',
      adresseFiscaleDeTaxationCodePostal: '75007 Paris',
      adresseFiscaleDeTaxationCommune: '',
      nombreDePersonnesACharge: '0',
      nombreDePersonnesAChargeF: '0',
      nombreDePersonnesAChargeH: '0',
      nombreDePersonnesAChargeR: '0',
      nombreDePersonnesAChargeJ: '0',
      nombreDePersonnesAChargeN: '0',
      nombreDePersonnesAChargeP: '0',
    };

    expect(format(databaseEntry)).to.deep.equal({
      aft: ' 20 avenue de Ségur 75007 Paris',
      aftDetail: {
        codePostal: '75007 Paris',
        commune: null,
        complementAdresse: null,
        voie: '20 avenue de Ségur',
      },
      pac: {
        nbPac: '0',
        nbPacF: '0',
        nbPacH: '0',
        nbPacJ: '0',
        nbPacN: '0',
        nbPacP: '0',
        nbPacR: '0',
      },
    });
  });

  it('should not modify object with attributes that does not have a dgfip label', () => {
    const databaseEntry = {
      dataNotToBeModified: '0',
    };

    expect(format(databaseEntry)).to.deep.equal({
      dataNotToBeModified: '0',
    });
  });
});

describe('reconcile', () => {
  it('should not match when FC user does not have birthcountry', (done) => {
    const userFromFranceConnect = {
      given_name: 'Carlós',
      family_name: 'Nuñez',
      birthdate: '1970-08-16',
      gender: 'male',
    };
    reconcile(userFromFranceConnect).then((record) => {
      expect(record).to.be.null;
      done();
    }).catch(err => done(err));
  });

  it('should match one user with accented names', (done) => {
    const userFromFranceConnect = {
      given_name: 'Carlós',
      family_name: 'Nuñez',
      birthdate: '1970-08-16',
      gender: 'male',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then(({ SPI }) => {
      expect(SPI).to.equal('3999999901234');
      done();
    }).catch(err => done(err));
  });

  it('should match the same user with other accent in his name', (done) => {
    const userFromFranceConnect = {
      given_name: 'Cårløs',
      family_name: 'Nunez',
      birthdate: '1970-08-16',
      gender: 'male',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then(({ SPI }) => {
      expect(SPI).to.equal('3999999901234');
      done();
    }).catch(err => done(err));
  });

  it('should return null for namesakes', (done) => {
    const userFromFranceConnect = {
      given_name: 'Dupont',
      family_name: 'Martine',
      birthdate: '1970-08-16',
      gender: 'male',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then((record) => {
      expect(record).to.be.null;
      done();
    }).catch(err => done(err));
  });
});
