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
		status: {
			duration: {
				doc: 'Amount of seconds to wait before changing statuses',
				format: Number,
				default: 60,
			},
			list: {
				doc: 'List of statuses for the bot to cycle through',
				format: Array,
				default: [],
			},
		}
	},
});

try {
	config.loadFile('config.toml');
} catch (err) {}

config.validate({ allowed: 'strict' });

module.exports = config;
