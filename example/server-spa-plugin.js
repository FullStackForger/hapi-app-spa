'use strict';
const Hapi = require('hapi');
const connection = { host: 'localhost', port: '3000' };
const plugins = [{
	register: require('../lib/hapi-app-spa'),
	options: {
		//index: 'index.html', // default
		assets: ['css', 'img', 'js', 'tpl', 'files']
	}
}];
const server = new Hapi.Server();
server.connection(connection);
server.register(plugins, (err) => {
	if (err) throw err;

	server.start((err) => {
		if (err) throw err;
		console.log('Server running at:', server.info.uri);
	});
});



