"use strict";

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.0",
		author: "NeoKEX",
		shortDescription: "Show commands",
		longDescription: "Show the command menu after replying to the help video.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {

		const allCommands = global.GoatBot.commands;
		const categories = {};

		const emojiMap = {
			ai: "➥",
			"ai-image": "➥",
			group: "➥",
			system: "➥",
			fun: "➥",
			owner: "➥",
			config: "➥",
			economy: "➥",
			media: "➥",
			"18+": "➥",
			tools: "➥",
			utility: "➥",
			info: "➥",
			image: "➥",
			game: "➥",
			admin: "➥",
			rank: "➥",
			boxchat: "➥",
			others: "➥"
		};

		const cleanCategoryName = (text) => {
			if (!text) return "others";

			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// =========================
		// COMMAND DETAILS
		// =========================

		if (args[0]) {
			const query = args[0].toLowerCase();

			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) =>
					(c.config.aliases || []).includes(query)
				);

			if (!cmd)
				return message.reply(`❌ Command "${query}" not found.`);

			const {
				name,
				version,
				author,
				guide,
				category,
				shortDescription,
				longDescription,
				aliases
			} = cmd.config;

			const desc =
				typeof longDescription === "string"
					? longDescription
					: longDescription?.en ||
					  shortDescription?.en ||
					  shortDescription ||
					  "No description";

			const usage =
				typeof guide === "string"
					? guide.replace(/{pn}/g, prefix)
					: guide?.en?.replace(/{pn}/g, prefix) ||
					  `${prefix}${name}`;

			const requiredRole =
				cmd.config.role !== undefined ? cmd.config.role : 0;

			return message.reply(
				`☠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ☠️\n\n` +
				`➥ Name: ${name}\n` +
				`➥ Category: ${category || "Uncategorized"}\n` +
				`➥ Description: ${desc}\n` +
				`➥ Aliases: ${
					aliases?.length ? aliases.join(", ") : "None"
				}\n` +
				`➥ Usage: ${usage}\n` +
				`➥ Permission: ${requiredRole}\n` +
				`➥ Author: ${author}\n` +
				`➥ Version: ${version}`
			);
		}

		// =========================
		// BUILD COMMAND MENU
		// =========================

		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);

			if (!categories[cat])
				categories[cat] = [];

			categories[cat].push(cmd.config.name);
		}

		const formatCommands = (cmds) =>
			cmds.sort().map((cmd) => `× ${cmd}`);

		let msg = `━━━☠️ 𝗡𝗲𝗼𝗞𝗘𝗫 𝗔𝗜 ☠️━━━\n`;

		const sortedCategories = Object.keys(categories).sort();

		for (const cat of sortedCategories) {

			const emoji = emojiMap[cat] || "➥";

			msg += `\n╭──『 ${cat.toUpperCase()} 』\n`;

			msg += `${formatCommands(categories[cat]).join(" ")}\n`;

			msg += `╰────────────◊\n`;
		}

		msg +=
			`\n➥ Use: ${prefix}help [command name] for details\n` +
			`➥ Use: ${prefix}callad to talk with bot admins '_'`;

		// =========================
		// SEND VIDEO FIRST
		// =========================

		const videoUrl = "https://files.catbox.moe/g3p14u.mp4";

		try {

			const stream =
				await global.utils.getStreamFromURL(videoUrl);

			const sent = await message.reply({
				body: "🎬 𝗡𝗘𝗢𝗞𝗘𝗫 𝗔𝗜\n\n" +
					  "↳ 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗺𝗲𝗻𝘂 👾",
				attachment: stream
			});

			// =========================
			// WAIT FOR REPLY TO VIDEO
			// =========================

			global.GoatBot.onReply.set(sent.messageID, {
				commandName: "help",
				messageID: sent.messageID,
				author: message.senderID,
				body: msg
			});

		} catch (error) {

			console.error(error);

			return message.reply(
				"❌ وقع مشكل وأنا كنرسل الفيديو."
			);
		}
	},

	onReply: async function ({ message, event, Reply }) {

		// غير الشخص اللي طلب help هو اللي يقدر يفتح المينيو
		if (
			Reply.author &&
			event.senderID !== Reply.author
		) {
			return;
		}

		return message.reply(Reply.body);
	}
};
