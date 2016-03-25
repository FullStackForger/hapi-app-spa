'use strict';
const Hapi = require('hapi');
const Path = require('path');
const connection = { host: 'localhost', port: '3000' };
const plugins = [{
	register: require('../'),
	options: {
		//index: 'index.html', // default
		//assets: ['css', 'img', 'js', 'tpl', 'files'], // default
		relativeTo: Path.join(__dirname, './public/angular-app')
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



