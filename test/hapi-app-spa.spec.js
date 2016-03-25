'use strict';
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Spa = require('..');
const Path = require('path');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.beforeEach;
const beforeEach = lab.beforeEach;

describe('hapi-app-spa', () => {

	let server;

	beforeEach((done) => {
		server = new Hapi.Server();
		server.connection();
		done();
	});

	it('should register', (done) => {
		server.register(require('../lib/hapi-app-spa'), (err) => {
			expect(err).to.not.exist();

			server.initialize((err) => {
				expect(err).to.not.exist();
				done();
			});
		});

	});

	it('should respond with 404', (done) => {

		server.register(require('../lib/hapi-app-spa'), (err) => {
			expect(err).to.not.exist();

			server.initialize((err) => {
				expect(err).to.not.exist();

				server.inject('/', (res) => {
					expect(res.statusCode).to.equal(404);
					done();
				});
			});
		});
	});
	it('should respond with file', (done) => {
		const plugin = {
			register: require('../lib/hapi-app-spa'),
			options: {
				relativeTo: Path.join(__dirname, '../')
			}
		};

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
