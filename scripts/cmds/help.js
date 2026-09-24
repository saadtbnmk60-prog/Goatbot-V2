"use strict";

const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.0",
		author: "NeoKEX",
		shortDescription: "Show commands inside video",
		longDescription: "Automatically adds the command menu to the help video.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {

		// رابط الفيديو الجديد
		const videoUrl = "https://files.catbox.moe/b0jzu3.mp4";

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

		// إنشاء نص الأوامر
		let menuText = "NEOKEX AI\\n\\n";

		const sortedCategories =
			Object.keys(categories).sort();

		for (const cat of sortedCategories) {

			menuText +=
				"[" + cat.toUpperCase() + "]\\n";

			for (const command of categories[cat].sort()) {
				menuText += "× " + command + "\\n";
			}

			menuText += "\\n";
		}

		menuText +=
			"Use " + prefix + "help command for details";

		const cacheDir = path.join(__dirname, "cache");

		await fs.ensureDir(cacheDir);

		const inputVideo =
			path.join(cacheDir, `help_${Date.now()}.mp4`);

		const outputVideo =
			path.join(cacheDir, `help_result_${Date.now()}.mp4`);

		try {

			// تحميل الفيديو
			const response = await fetch(videoUrl);

			if (!response.ok)
				throw new Error("Failed to download video");

			const buffer =
				Buffer.from(await response.arrayBuffer());

			await fs.writeFile(inputVideo, buffer);

			// تجهيز النص لـ FFmpeg
			const escapedText = menuText
				.replace(/\\/g, "\\\\")
				.replace(/:/g, "\\:")
				.replace(/'/g, "\\'")
				.replace(/%/g, "\\%");

			const filter =
				`drawtext=` +
				`fontcolor=white:` +
				`fontsize=28:` +
				`x=40:` +
				`y=40:` +
				`line_spacing=8:` +
				`box=1:` +
				`boxcolor=black@0.65:` +
				`boxborderw=20:` +
				`text='${escapedText}'`;

			const command =
				`ffmpeg -y ` +
				`-i "${inputVideo}" ` +
				`-vf "${filter}" ` +
				`-c:v libx264 ` +
				`-preset veryfast ` +
				`-crf 28 ` +
				`-c:a copy ` +
				`"${outputVideo}"`;

			// معالجة الفيديو
			await new Promise((resolve, reject) => {

				exec(command, (error, stdout, stderr) => {

					if (error) {
						console.error("FFmpeg Error:", stderr);
						return reject(error);
					}

					resolve();
				});

			});

			// إرسال الفيديو
			return message.reply({
				body: "🎬 𝗡𝗘𝗢𝗞𝗘𝗫 𝗔𝗜\n📋 Commands Menu",
				attachment: fs.createReadStream(outputVideo)
			});

		} catch (error) {

			console.error(error);

			return message.reply(
				"❌ وقع مشكل أثناء تجهيز الفيديو.\n" +
				"تأكد أن FFmpeg خدام مزيان."
			);

		} finally {

			setTimeout(async () => {

				await fs.remove(inputVideo).catch(() => {});
				await fs.remove(outputVideo).catch(() => {});

			}, 30000);
		}
	}
};
