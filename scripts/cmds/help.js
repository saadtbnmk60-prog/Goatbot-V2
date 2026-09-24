"use strict";

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.4",
		author: "NeoKEX",
		shortDescription: "Show commands",
		longDescription: "Send a random help video and show commands when replied.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		// ==========================
		// تنظيف أسماء التصنيفات
		// ==========================

		const cleanCategoryName = (text) => {
			if (!text) return "others";

			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// ==========================
		// جمع الأوامر حسب التصنيف
		// ==========================

		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);

			if (!categories[cat]) {
				categories[cat] = [];
			}

			categories[cat].push(cmd.config.name);
		}

		// ==========================
		// معلومات أمر معين
		// ==========================

		if (args[0]) {
			const query = args[0].toLowerCase();

			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) =>
					(c.config.aliases || []).some(
						(alias) => alias.toLowerCase() === query
					)
				);

			if (!cmd) {
				return message.reply(
					`❌ Command "${query}" not found.`
				);
			}

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
				`╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
				`      𓆩 𝗦𝗛𝗧𝗢𝗧 𝗕𝗢𝗧 𓆪\n` +
				`       ✦ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ✦\n` +
				`╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +

				`✦ 𝗡𝗮𝗺𝗲 : ${name}\n` +
				`✦ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${category || "Uncategorized"}\n` +
				`✦ 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 : ${desc}\n` +
				`✦ 𝗔𝗹𝗶𝗮𝘀𝗲𝘀 : ${
					aliases?.length
						? aliases.join(", ")
						: "None"
				}\n` +
				`✦ 𝗨𝘀𝗮𝗴𝗲 : ${usage}\n` +
				`✦ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 : ${requiredRole}\n` +
				`✦ 𝗔𝘂𝘁𝗵𝗼𝗿 : ${author}\n` +
				`✦ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : ${version}\n\n` +

				`╰━━━━━━━━━━━━━━━━━━━━━━╯`
			);
		}

		// ==========================
		// إيموجي كل Category
		// ==========================

		const categoryEmoji = {
			ai: "🤖",
			"ai-image": "🎨",
			fun: "🎮",
			game: "🎲",
			economy: "💰",
			media: "🎬",
			image: "🖼️",
			tools: "🛠️",
			utility: "🔧",
			info: "ℹ️",
			system: "⚙️",
			admin: "👑",
			owner: "☠️",
			config: "⚙️",
			group: "👥",
			rank: "🏆",
			boxchat: "💬",
			"18+": "🔞",
			others: "📦"
		};

		// ==========================
		// تنسيق الأوامر
		// ==========================

		const formatCommands = (cmds) => {
			return cmds
				.sort((a, b) => a.localeCompare(b))
				.map((cmd) => `│ ✧ 𝗵𝗲𝗹𝗽 → ${cmd}`)
				.join("\n");
		};

		// ==========================
		// رأس القائمة
		// ==========================

		let msg =
			`╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
			`      𓆩 𝗦𝗛𝗧𝗢𝗧 𝗕𝗢𝗧 𓆪\n` +
			`       ✦ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ✦\n` +
			`╰━━━━━━━━━━━━━━━━━━━━━━╯\n`;

		// ==========================
		// جميع Categories
		// ==========================

		const sortedCategories =
			Object.keys(categories).sort();

		for (const cat of sortedCategories) {
			const emoji =
				categoryEmoji[cat] || "📦";

			msg +=
				`\n` +
				`╭───────「 ${emoji} 𝗙𝗨𝗡 」───────╮\n`;

			// اسم Category مزخرف
			const categoryTitle = cat.toUpperCase();

			msg = msg.slice(
				0,
				msg.lastIndexOf(
					`「 ${emoji} 𝗙𝗨𝗡 」`
				)
			);

			msg +=
				`「 ${emoji} 𝗙𝗨𝗡 」\n`;

			msg +=
				`╰──────────────────────────╯\n`;

			// الأوامر
			msg +=
				formatCommands(categories[cat]) +
				`\n`;
		}

		// ==========================
		// إعادة بناء القائمة بشكل مرتب
		// ==========================

		msg =
			`╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
			`      𓆩 𝗦𝗛𝗧𝗢𝗧 𝗕𝗢𝗧 𓆪\n` +
			`       ✦ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ✦\n` +
			`╰━━━━━━━━━━━━━━━━━━━━━━╯\n`;

		for (const cat of sortedCategories) {
			const emoji =
				categoryEmoji[cat] || "📦";

			const categoryTitle =
				cat
					.toUpperCase()
					.replace(/AI-IMAGE/g, "AI IMAGE");

			const commands =
				categories[cat]
					.sort((a, b) =>
						a.localeCompare(b)
					)
					.map(
						(cmd) =>
							`│ ✧ 𝗵𝗲𝗹𝗽 → ${cmd}`
					)
					.join("\n");

			msg +=
				`\n` +
				`╭────「 ${emoji} 𝗙𝗨𝗡 」────╮\n` +
				`${commands}\n` +
				`╰────────────────────────╯\n`;
		}

		// ==========================
		// أسفل القائمة
		// ==========================

		msg +=
			`\n` +
			`╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
			`        ♡ 𝗦𝗛𝗧𝗢𝗧 𝗕𝗢𝗧 ♡\n` +
			`     𝗬𝗼𝘂𝗿 𝗛𝗲𝗹𝗽 𝗖𝗲𝗻𝘁𝗲𝗿\n` +
			`╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +

			`➥ 𝗨𝘀𝗲 : ${prefix}help [command]\n` +
			`   └─ ✦ Command details\n\n` +

			`➥ 𝗨𝘀𝗲 : ${prefix}callad\n` +
			`   └─ ✦ Contact bot admins`;

		// ==========================
		// الفيديوهات
		// ==========================

		const videoUrls = [
			"https://files.catbox.moe/gcmoc8.mp4",
			"https://files.catbox.moe/d3fajd.mp4"
		];

		const videoUrl =
			videoUrls[
				Math.floor(
					Math.random() * videoUrls.length
				)
			];

		try {
			const video =
				await global.utils.getStreamFromURL(
					videoUrl
				);

			// إرسال الفيديو
			const sentMessage =
				await message.reply({
					body:
						"🎬 𝗦𝗛𝗧𝗢𝗧 𝗕𝗢𝗧\n\n" +
						"↳ 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝗿 𝗺𝗲𝗻𝘂 📋",
					attachment: video
				});

			// حفظ القائمة
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

	// ==========================
	// فتح القائمة بالـ Reply
	// ==========================

	onReply: async function ({
		message,
		event,
		Reply
	}) {
		// غير صاحب help يقدر يفتح القائمة
		if (
			Reply.author &&
			event.senderID !== Reply.author
		) {
			return;
		}

		return message.reply(
			Reply.body
		);
	}
};
