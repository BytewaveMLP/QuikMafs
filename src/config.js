const toml = require('toml');
const convict = require('convict');

convict.addParser({ extension: 'toml', parse: toml.parse });

const config = convict({
	discord: {
		authToken: {
			doc: 'Token to authenticate to Discord with',
			format: String,
			default: undefined,
			env: 'DISCORD_AUTH_TOKEN',
			sensitive: true,
		},
		prefix: {
			doc: 'Prefix for bot commands',
			format: String,
			default: '$$',
		},
	},
});

try {
	config.loadFile('config.toml');
} catch (err) {}

config.validate({ allowed: 'strict' });

module.exports = config;
