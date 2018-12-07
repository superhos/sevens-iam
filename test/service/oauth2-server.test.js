'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const mm = require('egg-mock');
const expect = require('chai').expect;
const { version } = require('../../package.json');
// const cheerio = require('cheerio');

// Test Data
let code;
let accessToken;

// Tools
function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

describe('service/oauth2-server.test.js', () => {

  after(() => app.close());

  before(() => {
    mm.consoleLevel('NONE');
  });

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
      .expect(400);
  });

  // it('correct data and no login GET /oauth2/authorize', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/authorize?client_id=sevens-web&redirect_uri=http://iam.sevens.com/test&scope=all&response_type=code&state=&locale=zh-CN')
  //     .expect(200)
  //     .expect(res => {
  //       const $ = cheerio.load(res.text);
  //       assert($('el-input').length === 2);
  //     });
  // });

  it('incorrect data POST /user/login', () => {
    return app.httpRequest()
      .post('/user/login')
      .send({
        redirect_url: '/oauth2/authorize?client_id=sevens-web&redirect_uri=http://iam.sevens.com/test&scope=all&response_type=code&state=&locale=zh-CN',
        username: 'sevens',
        password: '123465',
      })
      .expect(500);
  });

  it('correct data POST /user/login', () => {
    const redirect_url = '/oauth2/authorize?client_id=sevens-web&redirect_uri=http://iam.sevens.com/test&scope=all&response_type=code&state=&locale=zh-CN';
    return app.httpRequest()
      .post('/user/login')
      .send({
        redirect_url,
        username: 'sevens',
        password: '123456',
      })
      // Redirect to authorize page
      .expectHeader('set-cookie')
      .expect(302)
      .expect(res => assert(res.header.location === redirect_url));
  });

  it('correct data and logged in POST /oauth2/authorize', () => {
    app.mockSession({
      user: {
        _id: '5bf50b8ef633e10bd89b7a0d',
        username: 'sevens',
        password: 'e10adc3949ba59abbe56e057f20f883e',
      },
    });

    return app.httpRequest()
      .post('/oauth2/authorize')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        client_id: 'sevens-web',
        redirect_uri: 'http://iam.sevens.com/test',
        scope: 'all',
        response_type: 'code',
        state: 'get_code',
      })
      .expect(302)
      .expect(res => {
        const codedata = getParameterByName('code', res.header.location);
        assert.ok(codedata.length === 40);
        code = codedata;
      });
  });

  it('correct Authorization, corrent code and logged in POST /oauth2/access_token', () => {
    return app.httpRequest()
      .post('/oauth2/access_token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG',
      })
      .send({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://iam.sevens.com/test',
      })
      .expect(200)
      .then(({ body }) => {
        assert.ok(body.access_token.length === 40);
        assert.ok(body.refresh_token.length === 40);
        accessToken = body.access_token;
      });
  });

  it('correct Authorization, corrent code and logged (code only can use one time) in POST /oauth2/access_token', () => {
    return app.httpRequest()
      .post('/oauth2/access_token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG',
      })
      .send({
        grant_type: 'authorization_code',
        code,
      })
      .expect(400)
      .then(({ body }) => {
        assert.ok(body.error === 'invalid_grant');
      });
  });

  // it('correct Authorization, incorrect Data and logged in POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .set({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG',
  //     })
  //     .send({
  //       grant_type: 'authorization_code',
  //       code,
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       assert.ok(body.error === 'invalid_request');
  //     });
  // });

  // it('correct Authorization, failed code and logged in POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .set({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG',
  //     })
  //     .send({
  //       grant_type: 'authorization_code',
  //       code: 'failed',
  //       redirect_uri: 'http://iam.sevens.com/test',
  //     })
  //     .expect(503)
  //     .then(({ body }) => {
  //       assert.ok(body.error === 'server_error');
  //     });
  // });

  // it('correct Authorization, corrent code and logged in POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .set({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic c2V2ZW5zLXdlYjozSzBJMXVmVWtLaXZTYzZPQ3hCOGdHdWtLNFI3RmJuZkpZaU1rSVFG',
  //     })
  //     .send({
  //       grant_type: 'authorization_code',
  //       code,
  //       redirect_uri: 'http://iam.sevens.com/test',
  //     })
  //     .expect(200)
  //     .then(({ body }) => {
  //       assert.ok(body.access_token.length === 40);
  //       assert.ok(body.refresh_token.length === 40);
  //     });
  // });

  it('incorrect Authorization Get /oauth2/authenticate', () => {
    return app.httpRequest()
      .get('/oauth2/authenticate')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer WRONDSFNSDOFN',
      })
      .expect(401)
      .then(({ body }) => {
        assert.ok(body.error === 'invalid_token');
      });
  });

  it('correct Authorization Get /oauth2/authenticate', () => {
    return app.httpRequest()
      .get('/oauth2/authenticate')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + accessToken,
      })
      .expect(200)
      .then(({ body }) => {
        assert.ok(body.result === 'ok');
      });
  });

  // it('GET /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/access_token')
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).to.equal('invalid_request')
  //     })
  // })

  // it('no header POST /oauth2/access_token', () => {
  //   return app.httpRequest()
  //     .post('/oauth2/access_token')
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).to.equal('invalid_request')
  //     })
  // })

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
  //       expect(body.error).to.equal('invalid_client')
  //     })
  // })

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
  //       expect(body.token_type).to.equal('Bearer')
  //       expect(body.access_token.length).to.equal(40)
  //     })
  // })

  // it('incorrect GET /oauth2/authenticate', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/authenticate')
  //     .expect(401)
  //     .expect('Unauthorized')
  // })

  // it('correct GET /oauth2/authenticate', () => {
  //   return app.httpRequest()
  //     .get('/oauth2/authenticate')
  //     .set({
  //       Authorization: 'Bearer 3a35e7e72f0d054f9fc324518d70ffc693b08ee7',
  //     })
  //     .expect(200)
  // })
});
