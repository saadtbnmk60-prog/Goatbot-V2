"use strict";

module.exports = {
	config: {
		name: "afshakh",
		aliases: ["افشخ", "afch"],
		author: "Neoaz 🐊",
		category: "fun",
		cooldown: 2,
		role: 0,
		description: {
			en: "Send every word of a replied message separately"
		}
	},

	onStart: async function ({ api, event }) {
		// خاص الأمر يكون Reply على رسالة
		if (!event.messageReply) {
			return api.sendMessage(
				"❌ خاصك تدير Reply على الرسالة اللي بغيتي نفشخها 😭",
				event.threadID,
				event.messageID
			);
		}

		const text = event.messageReply.body;

		if (!text || !text.trim()) {
			return api.sendMessage(
				"❌ الرسالة اللي رديتي عليها ما فيها حتى نص.",
				event.threadID,
				event.messageID
			);
		}

		// تقسيم النص إلى كلمات
		const words = text.trim().split(/\s+/);

		// إرسال كل كلمة، بفارق 0.5 ثانية
		for (const word of words) {
			await api.sendMessage(word, event.threadID);

			// 500ms = 0.5 ثانية
			await new Promise(resolve => setTimeout(resolve, 500));
		}
	}
};
