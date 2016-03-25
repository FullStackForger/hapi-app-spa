'use strict';
const Hoek = require('hoek');
const Boom = require('boom');
const Inert = require('inert');

const Path = require('path');
const Url = require('url');

exports.register = function (server, options, next) {

	const defaults = {
		assets: ['css', 'img', 'js', 'tpl', 'files'],
		index: 'index.html',
		relativeTo: Path.join(__dirname, '../public'),
		url: '/' // should always end with /, eg: my-app/
	};

	const settings = Hoek.applyToDefaults(defaults, options);

	server.register({ register: Inert, options: {} }, (err) => {
		server.route({
			method: 'GET',
			path: '/{path*}',
			handler: function (request, reply) {
				if (request.params.path) {
					const pathParam = request.params.path;
					const pathBits = pathParam.indexOf('/') > -1 ? pathParam.split('/') : [ pathParam ];
					const parentDir = pathBits.length > 1 ? pathBits[0] : undefined;
					const dotIndex = pathBits[pathBits.length - 1].lastIndexOf('.');
					const isFile =  dotIndex > -1;
					const allowFile = !parentDir || settings.assets.indexOf(parentDir) > -1;

					if (isFile && allowFile) {
						return reply.file(request.params.path);
					} else if (isFile) {
						return reply(Boom.notFound(`resource ${request.params.path} not found`));
					}
				}

				reply.file(settings.index);
				//reply.redirect(Url.resolve(settings.url, settings.index));
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