'use strict';

const { app } = require('egg-mock/bootstrap');
const expect = require('chai').expect;
const { version } = require('../../package.json');

describe('service/oauth2-server.test.js', () => {

  after(() => app.close());

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(`{"version":"${version}"}`)
      .expect(200);
  });

  it('no data GET /oauth2/authorize', () => {
    return app.httpRequest()
      .post('/oauth2/authorize')
      .expect(400)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_request');
      });
  });

  it('correct data but not login POST /oauth2/authorize', () => {
    return app.httpRequest()
      .post('/oauth2/authorize')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        client_id: 'sevens-web',
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_login');
      });
  });

  it('no data and no login GET /oauth2/authorize', () => {
    return app.httpRequest()
      .get('/oauth2/authorize')
      .expect(400)
  });

  // it('GET /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/access_token')
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).to.equal('invalid_request');
  //     });
  // });

  // it('no header POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).to.equal('invalid_request');
  //     });
  // });

  // it('incorrect Authorization POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .set({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic ZWdnL',
  //     })
  //     .send({
  //       grant_type: 'password',
  //       username: 'sevens',
  //       password: '123456',
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).to.equal('invalid_client');
  //     });
  // });

  // it('correct POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .set({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG==',
  //       // Basic base64(my_app:my_secret)
  //     })
  //     .send({
  //       grant_type: 'password',
  //       username: 'sevens',
  //       password: '123456',
  //     })
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body.token_type).to.equal('Bearer');
  //       expect(body.access_token.length).to.equal(40);
  //     });
  // });

  // it('incorrect GET /oauth2/authenticate', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/authenticate')
  //     .expect(401)
  //     .expect('Unauthorized');
  // });

  // it('correct GET /oauth2/authenticate', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/authenticate')
  //     .set({
  //       Authorization: 'Bearer 3a35e7e72f0d054f9fc324518d70ffc693b08ee7',
  //     })
  //     .expect(200);
  // });
});
