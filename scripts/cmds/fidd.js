"use strict";

module.exports = {
  config: {
    name: "فديو",
    aliases: ["video", "فيديو"],
    author: "Neoaz 🐊",
    category: "fun",
    cooldown: 5,
    role: 0,
    noPrefix: true,
    description: "يرسل الفيديو"
  },

  onStart: async function ({ message }) {
    const videoUrl = "https://files.catbox.moe/g3p14u.mp4";

    return message.reply({
      body: "🎬 تفضل الفيديو ❤️",
      attachment: await global.utils.getStreamFromURL(videoUrl)
    });
  }
};
