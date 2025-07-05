const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "اوتو",
    version: "0.0.2",
    hasPermssion: 0,
    credits: "SHAON",
    description: "تنزيل مقاطع الفيديو تلقائيًا عند إرسال رابط",
    commandCategory: "قــســم الــادوات",
    usages: "",
    cooldowns: 5
  },

  languages: {
    en: {
      downloading: "⏳ يرجى الانتظار، جاري تحميل الفيديو الخاص بك...",
      success: "🎬 تمتع بالفيدو الخاص بك !",
      error: "❌ فشل تنزيل الفيديو."
    },
    vi: {
      downloading: "⏳ Vui lòng chờ, đang tải video...",
      success: "🎬 Chúc bạn xem vui vẻ!",
      error: "❌ Không thể tải video."
    }
  },

  run: async function ({ api, event, args }) {
    // This command does not need to be called directly
    return api.sendMessage("⚠️ يعمل هذا الأمر تلقائيًا عند إرسال رابط فيديو.", event.threadID, event.messageID);
  },

  handleEvent: async function ({ api, event, getText }) {
    const content = event.body || '';
    const body = content.toLowerCase();

    if (!body.startsWith("https://")) return;

    try {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      api.sendMessage(getText("downloading"), event.threadID, event.messageID);

      const data = await alldown(content);
      const videoUrl = data.url;

      api.setMessageReaction("☢️", event.messageID, () => {}, true);

      const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;

      const filePath = path.join(__dirname, "cache", "auto.mp4");
      fs.writeFileSync(filePath, Buffer.from(videoBuffer, "utf-8"));

      return api.sendMessage({
        body: `🔥🚀 AMAKI-BOT | 🔥💻\n📥⚡𝗔𝘂𝘁𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿⚡📂\n${getText("success")}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error("❌ Error:", err);
      api.sendMessage(getText("error"), event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
