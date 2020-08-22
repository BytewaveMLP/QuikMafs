const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');
const MathJax = require('mathjax-node');
const sharp = require('sharp');

MathJax.config({
	displayErrors: false,
});

const padding = 5;

const config = require('./config');

const client = new Discord.Client();

const prefix = config.get('discord.prefix');

client.once('ready', () => {
	console.log(`Ready at ${(new Date()).toISOString()}`);
	console.log(`Logged in as @${client.user.tag} (${client.user.id})`);
});

client.on('message', async msg => {
	const logPrefix = `${msg.channel.id}:${msg.id} -`;
	if (!msg.content.startsWith(prefix)) return;

	let tex = msg.content.slice(prefix.length).trim();
	if (tex.endsWith(prefix)) tex = tex.slice(0, -prefix.length).trimRight();
	if (!tex) return;

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
		console.error(`${logPrefix} Processing failed!
\t${errors.join('\n\t')}`);
		msg.reply(`There was an error parsing your input:
${errors.join('\n')}`);
	}
});

client.login(config.get('discord.authToken'));
