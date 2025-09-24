/*
 * apidocts
 * https://apidocts.com
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 * 
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

import assert from 'assert';
import UrlProcessor from '../template/src/sampreq_url_processor';

const UrlProc = new UrlProcessor();

describe('test sample request url processor', () => {
  it('should hydrate correctly a complete url', done => {
    const dryUrl = 'https://api.example.org/user/:id/:group/:city';
    const parameters = {};
    parameters['id'] = '3';
    parameters['group'] = 'blah';
    parameters['city'] = 'paris';
    parameters['view'] = 'aerial';
    const url = UrlProc.hydrate(dryUrl, parameters);
    assert.strictEqual(url, 'https://api.example.org/user/3/blah/paris?view=aerial');
    done();
  });

  it('should hydrate correctly an empty url', done => {
    const dryUrl = 'https://api.example.org/user/';
    const parameters = {};
    const url = UrlProc.hydrate(dryUrl, parameters);
    assert.strictEqual(url, 'https://api.example.org/user/');
    done();
  });

  it('should hydrate correctly an url with optional parameter', done => {
    const dryUrl = 'https://api.example.org/user/:id/:group/:city';
    const parameters = {};
    parameters['id'] = '3';
    parameters['group'] = 'blah';
    parameters['city'] = '';
    const url = UrlProc.hydrate(dryUrl, parameters);
    assert.strictEqual(url, 'https://api.example.org/user/3/blah/');
    done();
  });

  it('case 1: should hydrate correctly an url with standard parameter', done => {
    const dryUrl = 'https://api.example.org/user';
    const parameters = {};
    parameters['view'] = 'aerial';
    const url = UrlProc.hydrate(dryUrl, parameters);
    assert.strictEqual(url, 'https://api.example.org/user?view=aerial');
    done();
  });

  it('case 2: should hydrate correctly an url with standard parameter', done => {
    const dryUrl = 'https://api.example.org/user?dev=1';
    const parameters = {};
    parameters['view'] = 'aerial';
    const url = UrlProc.hydrate(dryUrl, parameters);
    assert.strictEqual(url, 'https://api.example.org/user?dev=1&view=aerial');
    done();
  });

});
