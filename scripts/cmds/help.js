"use strict";

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.1",
		author: "NeoKEX",
		shortDescription: "Show commands",
		longDescription: "Send a random help video and show commands when replied.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const cleanCategoryName = (text) => {
			if (!text) return "others";

			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// جمع الأوامر حسب التصنيف
		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);

			if (!categories[cat])
				categories[cat] = [];

			categories[cat].push(cmd.config.name);
		}

		// معلومات أمر معين
		if (args[0]) {
			const query = args[0].toLowerCase();

			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) =>
					(c.config.aliases || []).includes(query)
				);

			if (!cmd)
				return message.reply(
					`❌ Command "${query}" not found.`
				);

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
				cmd.config.role !== undefined
					? cmd.config.role
					: 0;

			return message.reply(
				`☠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ☠️\n\n` +
				`➥ Name: ${name}\n` +
				`➥ Category: ${category || "Uncategorized"}\n` +
				`➥ Description: ${desc}\n` +
				`➥ Aliases: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
				`➥ Usage: ${usage}\n` +
				`➥ Permission: ${requiredRole}\n` +
				`➥ Author: ${author}\n` +
				`➥ Version: ${version}`
			);
		}

		// إنشاء قائمة الأوامر
		const formatCommands = (cmds) =>
			cmds.sort().map((cmd) => `× ${cmd}`);

		let msg =
			`━━━☠️ 𝗡𝗲𝗼𝗞𝗘𝗫 𝗔𝗜 ☠️━━━\n`;

		for (const cat of Object.keys(categories).sort()) {
			msg += `\n╭──『 ${cat.toUpperCase()} 』\n`;
			msg += `${formatCommands(categories[cat]).join(" ")}\n`;
			msg += `╰────────────◊\n`;
		}

		msg +=
			`\n➥ Use: ${prefix}help [command name] for details\n` +
			`➥ Use: ${prefix}callad to talk with bot admins '_'`;

		// ==========================
		// الفيديوهات
		// ==========================

		const videoUrls = [
			"https://files.catbox.moe/b0jzu3.mp4",
			"https://files.catbox.moe/h5w58m.mp4"
		];

		// اختيار فيديو واحد عشوائياً
		const videoUrl =
			videoUrls[
				Math.floor(Math.random() * videoUrls.length)
			];

		try {
			const video =
				await global.utils.getStreamFromURL(videoUrl);

			// إرسال فيديو واحد فقط
			const sentMessage = await message.reply({
				body:
					"🎬 𝗡𝗲𝗼𝗞𝗘𝗫 𝗔𝗜\n\n" +
					"↳ 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝗿 𝗺𝗲𝗻𝘂 📋",
				attachment: video
			});

			// حفظ معلومات الرد
			global.GoatBot.onReply.set(
				sentMessage.messageID,
				{
					commandName: "help",
					messageID: sentMessage.messageID,
					author: message.senderID,
					body: msg
				}
			);

		} catch (error) {
			console.error(error);

			return message.reply(
				"❌ وقع مشكل وأنا كنرسل الفيديو."
			);
		}
	},

	onReply: async function ({ message, event, Reply }) {

		// غير الشخص اللي دار help يقدر يفتح القائمة
		if (
			Reply.author &&
			event.senderID !== Reply.author
		) {
			return;
		}

		return message.reply(Reply.body);
	}
};
