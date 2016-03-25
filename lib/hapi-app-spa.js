'use strict';
const Path = require('path');
const Hoek = require('hoek');
const Boom = require('boom');
const Inert = require('inert');

exports.register = function (server, options, next) {

	const defaults = {
		assets: ['css', 'img', 'js', 'partials', 'files'],
		index: 'index.html',
		relativeTo: Path.join(__dirname, '../public')
	};

	const settings = Hoek.applyToDefaults(defaults, options);

	server.register({ register: Inert, options: {} }, (err) => {
		server.route({
			method: 'GET',
			path: '/{path*}',
			handler: function (request, reply) {
				if (request.params.path) {
					const path = request.params.path.split('/');
					const pathBits = path.indexOf('/') > -1 ? path.split('/') : [ path ];
					const parentDir = pathBits.length > 1 ? pathBits[0] : undefined;
					const dotIndex = pathBits[pathBits.length - 1].lastIndexOf('.');
					const dotIndexMin = pathBits[pathBits.length - 1].length - 4;
					const isFile =  dotIndex >= dotIndexMin;
					const allowFile = !parentDir || settings.assets.indexOf(parentDir) > -1;

					if (isFile && allowFile) {
						return reply.file(request.params.path);
					} else if (isFile) {
						return reply(Boom.notFound(`resource ${request.params.path} not found`));
					}
				}

				reply.file(settings.index);
			},
			config: {
				files: {
					relativeTo: settings.relativeTo
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