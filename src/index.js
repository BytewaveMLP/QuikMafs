const fs = require('fs');
const path = require('path');
const escapeStrRegexp = require('escape-string-regexp');

const Discord = require('discord.js');
const MathJax = require('mathjax-node');
const sharp = require('sharp');

MathJax.config({
	displayErrors: false,
	extensions: '[siunitx]/siunitx.js',
	paths: {
		siunitx: 'https://raw.githubusercontent.com/burnpanck/MathJax-siunitx/ad0ea1b0a89662635ad01f4e115f43669c07e488',
	},
});
MathJax.start();

const padding = 5;

const config = require('./config');

const client = new Discord.Client();

const prefix = config.get('discord.prefix');
const postfix = config.has('discord.postfix') ? config.get('discord.postfix') : config.get('discord.prefix');

const texPattern = new RegExp(`^${escapeStrRegexp(prefix)}((.|\n)+?)${escapeStrRegexp(postfix)}$`, 'm');

const statuses = config.get('discord.status.list');
const statusDuration = config.get('discord.status.duration') * 1000;
let statusCounter = 0;

function setStatus(client) {
	client.user.setActivity(statuses[statusCounter++]);
	statusCounter %= statuses.length;
}

client.once('ready', async () => {
	console.log(`Ready at ${(new Date()).toISOString()}`);
	console.log(`Logged in as @${client.user.tag} (${client.user.id})`);
	const invite = await client.generateInvite(['SEND_MESSAGES', 'ATTACH_FILES']);
	console.log(`Use this link to invite me to a server:
\t${invite}`);

	if (statuses) {
		setStatus(client);
		client.setInterval(() => setStatus(client), statusDuration);
	}
});

client.on('message', async msg => {
	const logPrefix = `${msg.channel.id}:${msg.id} -`;
	if (!msg.content) return;
	
	const matches = msg.content.match(texPattern);
	if (!matches) return;
	const tex = matches[1].trim();

	console.log(`${logPrefix} Processing TeX:
\t${tex}`);

	try {
		const output = await MathJax.typeset({
			svg: true,
			math: tex,
			speakText: false,
			timeout: 10 * 1000,
			linebreaks: true,
		});

		const png = await sharp(Buffer.from(output.svg, 'utf-8'), { density: 200 })
			.trim()
			.extend({ top: padding, left: padding, bottom: padding, right: padding, background: 'white' })
			.flatten({ background: 'white' })
			.png()
			.toBuffer();

		console.log(`${logPrefix} Processed successfully!`);
		await msg.reply(new Discord.MessageAttachment(png, 'output.png'));
	} catch (errors) {
		let errorStr = errors;
		if (Array.isArray(errors)) errorStr = errors.join('\n');
		console.error(`${logPrefix} Processing failed!`, errors);
		msg.reply(`There was an error parsing your input:
${errorStr}`);
	}
});

client.login(config.get('discord.authToken'));
