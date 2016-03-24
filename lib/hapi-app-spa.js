'use strict';
const Path = require('path');
const Hoek = require('hoek');
const Boom = require('boom');
const Inert = require('inert');

exports.register = function (server, options, next) {

	const defaults = {
		assets: ['css', 'img', 'js', 'partials', 'files'],
		index: 'index.html'
	};

	const settings = Hoek.applyToDefaults(defaults, options);

	server.register({ register: Inert, options: {} }, (err) => {
		server.route({
			method: 'GET',
			path: '/{path*}',
			handler: function (request, reply) {
				if (request.params.path) {
					let asset = request.params.path.split('/')[0];
					if (settings.assets.indexOf(asset) > -1) {
						return reply.file(request.params.path);
					} else {
						return reply(Boom.notFound(`resource ${request.params.path} not found`));
					}
				}
				reply.file(settings.index);
			},
			config: {
				files: {
					relativeTo: Path.join(__dirname, '../test/public/angular-app')
				}
			}
		});
		next();
	});

};

exports.register.attributes = {
	pkg: require('../package.json'),
	dependencies: ['inert']
};