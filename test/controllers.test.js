/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../src/app';
import {
  validTokenConf,
  validTokenWithoutTheRightScopesConf,
  initializeMock,
  malformedTokenConf,
  expiredTokenConf,
} from '../mock/france-connect';
import { FC_URL } from '../config';


chai.use(chaiHttp);
const { expect } = chai;

describe('GET /', () => {
  it('should return a 200 OK', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('GET /api/dgfip', () => {
  beforeEach(() => {
    initializeMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return 404 when asking for an undefined route', (done) => {
    chai.request(app)
      .get('/api/undefined-route')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 400 when no token is provided', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 400 when the token type is not Bearer', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Basic ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 502 when not able to connect to FranceConnect', (done) => {
    nock.cleanAll();
    nock(FC_URL)
      .post('/api/v1/checktoken', { token: validTokenConf.token })
      .replyWithError({ code: 'ECONNREFUSED' });

    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(502);
        done();
      });
  });

  it('should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${malformedTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${expiredTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 403 when user has not the right scope', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${validTokenWithoutTheRightScopesConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should return 200 with data according to user scopes', (done) => {
    chai.request(app)
      .get('/api/dgfip')
      .set('Authorization', `Bearer ${validTokenConf.token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          aft: ' 10 PLACE CONSTANTIN BRANCUSI 75014 PARIS',
          aftDetail: {
            codePostal: '75014 PARIS',
            commune: null,
            complementAdresse: null,
            voie: '10 PLACE CONSTANTIN BRANCUSI',
          },
          rfr: '15000',
          pac: {
            nbPacH: '0',
            nbPacJ: '0',
            nbPacN: '0',
            nbPacP: '0',
            nbPacF: '0',
            nbPac: '0',
            nbPacR: '0',
          },
        });
        done();
      });
  });
});
