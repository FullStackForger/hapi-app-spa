'use strict';
const Path = require('path');
const Hapi = require('hapi');

const server = new Hapi.Server({
	connections: {
		routes: {
			files: {
				// To simplify things, especially if you have multiple routes that respond with files,
				// you can configure a base path in your server and only pass relative paths to reply.file()
				relativeTo: Path.join(__dirname, './public/angular-app')
			}
		}
	}
});

const connection = {
	host: 'localhost',
	port: 3000
};

server.register(require('inert'), (err) => {
	if (err) throw err;
	server.connection(connection);
	var assets = ['css', 'img', 'js', 'tpl'];
	var index = 'index.html';
	server.route({
		method: 'GET',
		path: '/{path*}',
		handler: function (request, reply) {
			let path = request.params.path || index;
			let asset = path.split('/')[0];
			if (asset != index && assets.indexOf(asset) > -1) {
				return reply.file(request.params.path)
			}
			reply.file(index);
		}
	});

	server.start((err) => {
		if (err) throw err;
		console.log('Server running at:', server.info.uri);
	});
});