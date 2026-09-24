"use strict";

module.exports = {
	config: {
		name: "فديو",
		aliases: ["فيديو", "video"],
		version: "1.0",
		author: "NeoKEX",
		shortDescription: "إرسال الفيديو",
		longDescription: "يرسل الفيديو الموجود في الرابط",
		category: "fun",
		cooldown: 5,
		role: 0
	},

	onStart: async function ({ message }) {
		const videoUrl = "https://files.catbox.moe/g3p14u.mp4";

		try {
			const stream = await global.utils.getStreamFromURL(videoUrl);

			return message.reply({
				body: "🎬 تفضل الفيديو ❤️‍🔥",
				attachment: stream
			});
		} catch (error) {
			console.error(error);
			return message.reply("❌ وقع مشكل وأنا كنرسل الفيديو.");
		}
	}
};
