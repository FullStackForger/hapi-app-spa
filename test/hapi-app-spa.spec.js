'use strict';
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Spa = require('..');
const Path = require('path');
const Forger = require('forger');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.beforeEach;
const beforeEach = lab.beforeEach;

describe('hapi-app-spa', () => {

	describe('plugin', () => {

		it('should register', (done) => {
			const server = new Hapi.Server();
			server.connection();

			server.register(require('../lib/hapi-app-spa'), (err) => {
				expect(err).to.not.exist();

				server.initialize((err) => {
					expect(err).to.not.exist();
					done();
				});
			});
		});
	});

	describe('default options', () => {

		let server;

		beforeEach((done) => {
			server = new Hapi.Server();
			server.connection();
			server.register({
				register: require('../lib/hapi-app-spa'),
				options: {
					relativeTo: Path.join(__dirname, './public')
				}
			}, (err) => {
				server.initialize((err) => {
					done(err);
				});
			});
		});

		it('should serve index', (done) => {
			server.inject('/', (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.equal('<html><head><title>test</title></head><body><p>test</p></body></html>');
				done();
			});
		});

		it('should serve index for any non-file url', (done) => {
			server.inject('/custom/path', (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.equal('<html><head><title>test</title></head><body><p>test</p></body></html>');
				done();
			});
		});

		it('should respond with 404 for missing resources', (done) => {

			Forger.sequence(
				(next) => injectRequest('/css/missing.css', next),
				(next) => injectRequest('/tpl/missing.tpl.html', next),
				(next) => injectRequest('/js/missing.js', next),
				(next) => injectRequest('/file/missing.doc', next),
				(next) => injectRequest('/img/missing.jpg', next)
			).then(() => {
				done();
			}).catch((err) => {
				done(err);
			});

			function injectRequest(url, next) {
				server.inject(url, (res) => {
					expect(res.statusCode).to.equal(404);
					next(null);
				});
			}
		});


	});

	describe('custom options', () => {

		it('should respond with file', (done) => {

			const server = new Hapi.Server();
			const plugin = {
				register: require('../lib/hapi-app-spa'),
				options: {
					relativeTo: Path.join(__dirname, '../')
				}
			};

			server.connection();
			server.register(plugin, (err) => {
				expect(err).to.not.exist();

				server.initialize((err) => {
					expect(err).to.not.exist();

					server.inject('/package.json', (res) => {
						expect(res.statusCode).to.equal(200);

						var packageJson = JSON.parse(res.result);
						expect(packageJson.version).to.equal(require('../package.json').version);
						done();
					});
				});
			});
		});
	});
});

